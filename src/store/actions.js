import axios from 'axios'
import qs from 'QS'

export default{
    get_menuInit:({commit,state},params)=>{
        this.get('../static/json/menuCate.json')
        .then(res=>{
            console.log(res)
            commit('set_menuInit',res.data)
        }).catch(err=>{

        })
    }
}