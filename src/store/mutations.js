const mutations={
    set_menuInit:(state,datas) => {state.menuInit =datas},
    set_paneisShow:(state,datas) => {state.paneisShow = datas},
    set_menuActive:(state,datas) => {state.menuActive = datas},
    set_level3Data:(state,datas) => {state.level3Data = datas},
    set_wareDataInfo:(state,datas) => {state.wareDataInfo = datas},
    set_serviceCompVal:(state,datas) => {state.serviceCompVal = datas},
    set_searchTermData:(state,datas) => {
        if(datas){
            for(let i=0;i<state.searchTermData.length;i++){
                if(state.searchTermData[i].items.title == datas.items.title){return;}
                if(datas.item.type==state.searchTermData[i].item.type){
                    state.searchTermData.splice([i], 1);
                }
            }
            state.searchTermData.push(datas)
        }
    },
    removeTerm:(state,datas)=>{
        if(datas==0){//执行重置操作
            state.searchTermData.splice(1 , state.searchTermData.length);
        }
        if(datas.items.title==state.searchTermData[0].items.title){return;}//禁止删除第一个搜索条件
        state.searchTermData.splice(state.searchTermData.indexOf(datas), 1);
    }
}
export default mutations