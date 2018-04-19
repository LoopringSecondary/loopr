let fm = {}
fm.getVolume = (value)=>{
  value = Number(value)
  if(value>1000){
    return value.toFixed(0)
  }
  if(value<=1000 && value>=100){
    return value.toFixed(1)
  }
  if(value<=100 && value>=1){
    return value.toFixed(2)
  }
  if(value<1 && value>=0.001){
    return value.toFixed(5)
  }
  if(value<0.001 & value>0){
    return value.toFixed(8)
  }
  if(value===0){
    return '0.00'
  }
  if(!!value){
    return '0.00'
  }
}
fm.getPrice = (value)=>{
  value = Number(value)
  switch (true) {
    case value>1000:
      value = value.toFixed(2)
      break;
    case value<=1000 && value>=1:
      value = value.toFixed(2)
      break;
    case value<1 && value>=0.01:
      value = value.toFixed(5)
      break;
    case value<0.01 && value>0:
      value = value.toFixed(8)
      break;
    default:
      value = '0.00'
      break;
  }
  return value
}
fm.getChange = (value)=>{
  if(value){
    return value
  }else{
    return '0.00%'
  }
}

fm.getChangeSide = (value)=>{
  value = fm.getChange(value)
  const change = value.replace('%','')

  if(Number(change)>0){
    return 'up'
  }
  if(Number(change)<0){
    return 'down'
  }
  if(Number(change) == 0){
    return 'none'
  }

}

export default fm
