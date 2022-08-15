<%@ page language="java" import="java.util.*"  pageEncoding="GBK"%>  
<%@ page import="oracle.jdbc.driver.*"%>
<%@ page import="java.sql.*" %>
<%@ page import="com.alibaba.fastjson.*" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%!
Connection conn1 = null;

public Connection getConn() {
	try {
		Class.forName("oracle.jdbc.driver.OracleDriver");
		if (conn1 == null) {
			conn1 = DriverManager.getConnection("jdbc:oracle:thin:@localhost:1521:orcl", "agile", "sa");
		}
		return conn1;
	} catch (ClassNotFoundException e) {
		System.out.println("ClassNotFoundException:"+e);
	} catch (SQLException e) {
		System.out.println("SQLException:"+e);
	}
	return null;
}

public Vector readVector(Connection conn, String sql) {
	Statement stmt = null;
	ResultSetMetaData meta = null;
	int columnCount;
	ResultSet rs = null;

	Vector vRet = new Vector();
	try {
		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
		meta = rs.getMetaData();
		columnCount = meta.getColumnCount();
		while (rs.next()) {
			Hashtable hLine = new Hashtable();

			for (int i = 1; i <= columnCount; i++) {
				String temp = rs.getString(i);
				if (temp == null) {
					temp = "";
				}
				if (meta.getColumnType(i) == Types.NUMERIC) {
					if (temp.indexOf("-.") == 0) {
						temp = "-0." + temp.substring(2);
					}
				}
				if (!(meta.getColumnTypeName(i).equalsIgnoreCase("VARCHAR") || meta.getColumnTypeName(i)
						.equalsIgnoreCase("VARCHAR2"))) {
					if (temp.indexOf(".") == 0) {
						temp = "0" + temp;
					}
					if (temp.lastIndexOf(".0") > 0 && temp.lastIndexOf(".0") == temp.length() - 2)
						temp = temp.substring(0, temp.length() - 2);
				}
				hLine.put(meta.getColumnName(i).toLowerCase(), temp);
			}
			vRet.addElement(hLine);
		}
	} catch (SQLException e) {
		System.out.println("SQLException:"+e);
	}
	finally {
		try {
			if (rs != null) {
				rs.close();
			}
			if (stmt != null) {
				stmt.close();
			}
		} catch (SQLException sqle) {
			System.out.println("SQLException:"+sqle);
		} catch (Exception ex) {
			System.out.println("SQLException:"+ex);
		} catch (java.lang.Throwable te) {
			System.out.println("Throwable:"+te);
		}
	}
	return vRet;
}

public JSONObject getList(JSONObject oparam) {
	StringBuffer str = new StringBuffer();
	str.append("[{ event: \"click\", field: \"scode\", sequencekey: \"1\", templet: \"\", title: \"±àºÅ\", type: \"normal\", width: \"120\" }");
	str.append(",{ event: \"click\", field: \"sname\", sequencekey: \"2\", templet: \"\", title: \"Ãû³Æ\", type: \"normal\", width: \"200\" }");
	str.append(",{ event: \"click\", field: \"flowver\", sequencekey: \"2\", templet: \"\", title: \"°æ±¾\", type: \"normal\", width: \"80\" }]");
	
	JSONObject ojson = new JSONObject();
	ojson.put("headers", JSON.parseArray(str.toString()));

	JSONObject ortn = new JSONObject();
	ortn.put("data", ojson);

	String sql = "select a.entityid, a.flowid iid, a.flowcode scode, a.flowname sname, a.description, a.delflag,"
		+ " (select max(flowver) from cfg_wf_info where flowcode=a.flowcode) flowver " 
		+ " from cfg_wf_info a where flowver is null  ";
	Vector ovt = readVector(getConn(), sql);
	ojson.put("data", ovt);

	return ortn;
}

public JSONObject getListVer(JSONObject oparam) {
	StringBuffer str = new StringBuffer();
	str.append("[{ event: \"click\", field: \"scode\", sequencekey: \"1\", templet: \"\", title: \"±àºÅ\", type: \"normal\", width: \"120\" }");
	str.append(",{ event: \"click\", field: \"sname\", sequencekey: \"2\", templet: \"\", title: \"Ãû³Æ\", type: \"normal\", width: \"200\" }");
	str.append(",{ event: \"click\", field: \"flowver\", sequencekey: \"2\", templet: \"\", title: \"°æ±¾\", type: \"normal\", width: \"80\" }]");
	
	JSONObject ojson = new JSONObject();
	ojson.put("headers", JSON.parseArray(str.toString()));

	JSONObject ortn = new JSONObject();
	ortn.put("data", ojson);

	String sql = "select a.entityid, a.flowid iid, a.flowcode scode, a.flowname sname, a.description, a.delflag,a.flowver,b.flowcode flowmodelid " 
		+ " from cfg_wf_info a "
		+ " left outer join map_flow b on a.flowid=b.flowid "
		+ " where a.flowcode=(select flowcode from cfg_wf_info where flowid="+oparam.getString("flowid")+")"
		+ " order by a.flowver desc";

	Vector ovt = readVector(getConn(), sql);
	ojson.put("data", ovt);

	return ortn;
}
%>
<%

String sparam = request.getParameter("sparam");
JSONObject oparam = null;
if (StringUtils.isNotBlank(sparam)) {
	oparam = JSON.parseObject(sparam);
} else {
	oparam = new JSONObject();
}
System.out.println(oparam);

JSONObject ortn = new JSONObject();
if ("list".equals(oparam.getString("method"))) {
	ortn = getList(oparam);
}
else if ("listVer".equals(oparam.getString("method"))) {
	ortn = getListVer(oparam);
}
out.println(ortn);
%>