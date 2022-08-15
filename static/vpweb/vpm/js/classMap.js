function struct(key, value){
  this.key = key;
  this.value = value;
}

function setAt(key, value){
  for (var i = 0; i < this.map.length; i++)
  {
    if ( this.map[i].key === key )
    {
      this.map[i].value = value;
      return;
    }
  }  
  this.map[this.map.length] = new struct(key, value);
}

function lookUp(key)
{
  for (var i = 0; i < this.map.length; i++)
  {
    if ( this.map[i].key === key )
    {
      return this.map[i].value;
    }
  }  
  return null;
}

function removeKey(key)
{
  var v;
  for (var i = 0; i < this.map.length; i++)
  {
    v = this.map.pop();
    if ( v.key === key )
      continue;
      
    this.map.unshift(v);
  }
}

function getCount(){
  return this.map.length;
}

function isEmpty(){
  return this.map.length <= 0;
}

function classMap() {
  this.map = new Array();
  this.lookUp = lookUp;
  this.setAt = setAt;
  this.removeKey = removeKey;
  this.getCount = getCount;
  this.isEmpty = isEmpty;
}