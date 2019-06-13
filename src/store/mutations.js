const mutations={
    set_menuList:(state,datas) => {state.menuList = datas},
    set_selectMenuItem:(state,datas) => {
        for(let i=0; i < state.selectMenuItem.length; i++){
            if(state.selectMenuItem[i].name == datas.name){
                return;
            }
        }
        state.selectMenuItem.push(datas);
    },
    removeMenuItem:(state,datas) => {
        state.selectMenuItem.splice(datas,1)
    },
    emptySelectItem:(state,datas) => {
        state.selectMenuItem=[]
    }
}
export default mutations