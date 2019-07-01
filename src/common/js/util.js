export default{
    /**
     * test  实现模糊查询
     * list 数据组
     * keyword 查询关键字
     * arr 查询结果
    */
   fuzzyQuery:(list,keyword)=>{
       var reg =  new RegExp(keyword.toLowerCase());
       var arr = [];
       for(var i = 0; i < list.length; i++){
           if(reg.test(list[i].toLowerCase())){
               arr.push(list[i])
           }
       }
       return arr;
   }
}