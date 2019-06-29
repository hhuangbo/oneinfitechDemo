const mutations={
    set_menuActive:(state,datas) => {state.menuActive = datas},
    set_wareDataInfo:(state,datas) => {state.wareDataInfo = datas},
    set_searchTermData:(state,datas) => {
        console.log(state.searchTermData,datas)
        for(let i=0;i<state.searchTermData.length;i++){
            if(state.searchTermData[i].title == datas.title){return;}
        }
        state.searchTermData.push(datas)
    },
    removeTerm:(state,datas)=>{
        state.searchTermData.splice(state.searchTermData.indexOf(datas), 1);
    }
}
export default mutations