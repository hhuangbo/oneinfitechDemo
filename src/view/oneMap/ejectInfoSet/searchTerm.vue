<template>
    <div :class="[this.get_paneisShow ? 'searchTerm animated searchInLeftpx' : 'searchTerm animated  searchOutLeftpx']">
        <el-tag
            v-for="(tag,index) in searchTermData"
            :key="tag.item.title"
            closable
            :disable-transitions="false"
            color="#fff"
            @close="handleClose(tag)">
            <b>{{tag.item.title}}：</b><em>{{tag.items.title}}</em>
        </el-tag>

    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    data(){
        return{
            searchTerm:[]
        }
    },
    created(){

    },
    computed:{
        ...mapGetters(['searchTermData','get_paneisShow'])
    },
    watch:{
    },
    mounted(){
    },
    methods:{
        handleClose(item){
            this.$store.commit('removeTerm',item)
        },
        
    }
}
</script>

<style lang="scss" scoped>
.searchTerm{
    position: absolute;
    top: 20px;
    left: 18%;    
    background-color: #f9f9f9;
    max-width: 50%;
    padding: 2px 5px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.12);
    span{margin: 5px;}
    b{
        color: #333;
    }
    em{
        color: $Cfe6a01;
    }
}
.searchInLeftpx{
    animation-name: searchInLeftpx
}
.searchOutLeftpx{
    animation-name: searchOutLeftpx
}
@keyframes searchInLeftpx{
    0%{
        -webkit-transform: translate3d(-90%, 0, 0);
        transform: translate3d(-90%, 0, 0);
    }
    100%{
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
}
@keyframes searchOutLeftpx {
    0%{
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0); 
    }
    100%{
        -webkit-transform: translate3d(-100%, 0, 0);
        transform: translate3d(-190%, 0, 0);
    }
}
</style>

