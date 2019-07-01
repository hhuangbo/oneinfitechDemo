const mutations={
    set_menuInit:(state,datas) => {console.log(datas);state.menuInit =datas},

    set_menuActive:(state,datas) => {state.menuActive = datas},
    set_wareDataInfo:(state,datas) => {state.wareDataInfo = datas},
    set_parentLevel:(state,datas)=>{state.parentLevel=datas},
    set_searchTermData:(state,datas) => {
        console.log(state.parentLevel )
        // if(state.parentLevel==state.parentLevel){return;}
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