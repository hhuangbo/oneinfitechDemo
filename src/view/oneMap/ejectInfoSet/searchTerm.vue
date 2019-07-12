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
        <div class="reset" v-show="reset_isshow"  @click="handleClearTerm">重置</div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    data(){
        return{
            searchTerm:[],
            reset_isshow:false
        }
    },
    created(){

    },
    computed:{
        ...mapGetters(['searchTermData','get_paneisShow'])
    },
    watch:{
        searchTermData(data){
            data.length == 1 ? this.reset_isshow = false : this.reset_isshow = true;
        }
    },
    mounted(){
    },
    methods:{
        handleClose(item){
            this.$store.commit('removeTerm',item)
        },
        handleClearTerm(){
            this.$confirm('此操作将仅保留初次搜索的条件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.commit('removeTerm',0)
                this.$message({
                    type: 'success',
                    message: '重置成功!'
                });
            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     message: '已取消重置'
                // });          
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.searchTerm{
    position: absolute;
    top: 20px;
    left: 20rem;    
    background-color: #f9f9f9;
    max-width: 50%;
    padding: 2px 5px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.12);
    border-radius: 3px;
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
.reset{
    padding: 4px 10px;
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #e4e4e4;
    background-color: #fff;
    cursor: pointer;
    &:hover{
        background-color: rgba(254, 106, 1, 0.4);
        border:1px solid #ffc59c;
        color: #fff;
    }
}

@keyframes searchInLeftpx{
    0%{
        -webkit-transform: translate3d(-90%, 0, 0);
        transform: translate3d(-90%, 0, 0);
    }
    100%{
        -webkit-transform: translate3d(2rem, 0, 0);
        transform: translate3d(2rem, 0, 0);
    }
}
@keyframes searchOutLeftpx {
    0%{
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0); 
    }
    100%{
        -webkit-transform: translate3d(-16.5rem, 0, 0);
        transform: translate3d(-16.5rem, 0, 0);
    }
}
</style>

