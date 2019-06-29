<template>
    <div class="searchTerm">
        <el-tag
            v-for="tag in searchTermData"
            :key="tag"
            closable
            :disable-transitions="false"
            color="#fff"
            @close="handleClose(tag)">
            {{tag.title}}
        </el-tag>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    data(){
        return{
            term:['标签1','标签2']
        }
    },
    created(){

    },
    computed:{
        ...mapGetters(['searchTermData'])
    },
    watch:{
    },
    mounted(){
    },
    methods:{
        handleClose(item){
            this.$store.commit('removeTerm',item)
            // this.term.splice(this.term.indexOf(item), 1);
        }
    }
}
</script>

<style lang="scss" scoped>
.searchTerm{
    position: absolute;
    top: 50px;
    left: 18%;
    span{margin: 5px;}
}
</style>

