import axios from 'axios'
import qs from 'QS'

export default{
    get_menuData:({commit,state},params)=>{
        axios.get('../static/json/menuCate.json')
        .then(res=>{
            // commit('set_menuInit',res.data)
            return res.data
            console.log(res.data)
        }).catch(err=>{
            console.log(err)
        })
    },
    // get_menuData:()=>{
    //     axios.get('../static/json/menuCate.json',(res)=>{
    //         // commit('set_menuInit',res.data)
    //         return res.data
    //         console.log(res.data)
    //     })
    // }
}