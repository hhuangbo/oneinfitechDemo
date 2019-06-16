<template>
    <div>
        <ul class="ul1">
            <li class="li1" v-for="(item,index) in menuList">
                <span @click="setTegel(index)">
                    {{item.title}}
                </span>
                <ul class="ul2" v-if="item.level&&(active1 == index)">
                    <li class="li2" v-for="(items,indexs) in item.level">
                        <span @click="setTegel2(indexs)">
                            {{items.title}}
                        </span>
                        <ul class="ul3" v-if="items.info&&(active2 == indexs)&&item.type==1">
                            <li class="li3" v-for="(itemed,indexed) in items.info">
                                <span>{{itemed.title}}</span>
                            </li>
                        </ul>
                        <ul class="ul3_1" v-if="items.info&&(active2 == indexs)&&item.type==2">
                            <li class="li3_1" v-for="(itemed,indexed) in items.info">
                                <span>{{itemed.title}}</span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            menuList: [
                {
                    type: '1',
                    title: '仓库地址',
                    level: [
                        {
                            title: '北京',
                            info: [
                                { title: '仓库照片' },
                                { title: '基本信息' },
                                { title: '实时监控' }
                            ]
                        }
                    ]
                },
                {
                    type: '2',
                    title: '收获地址',
                    level: [
                        {
                            id: '1',
                            title: '北京',
                            lng: '116.413467',
                            lat: '39.923568',
                            num: '100',
                            info: [{ title: '海淀区' }, { title: '西城区' }]
                        },
                        {
                            id: '2',
                            title: '上海',
                            lng: '121.395016',
                            lat: '31.286479',
                            num: '80'
                        },
                        {
                            id: '3',
                            title: '杭州',
                            lng: '120.252438',
                            lat: '30.267079',
                            num: '60'
                        },
                        {
                            id: '4',
                            title: '广州',
                            lng: '113.265133',
                            lat: '23.128685',
                            num: '40'
                        },
                        {
                            id: '5',
                            title: '武汉',
                            lng: '114.299503',
                            lat: '30.66099',
                            num: '20'
                        },
                        {
                            id: '6',
                            title: '郑州',
                            lng: '113.616696',
                            lat: '34.749235',
                            num: '10'
                        },
                        {
                            id: '7',
                            title: '湖北',
                            lng: '108.958493',
                            lat: '34.387368',
                            num: '15'
                        }
                    ]
                },
                { title: '项目检索' },
                { title: '客户检索' },
                { title: '订单列表' },
                { title: '收货人' },
                { title: '发货人' },
                { title: '司机列表' },
                { title: '车辆检索' },
                { title: '仓库信息' },
                { title: '干线路线' },
                { title: '供应商' },
                { title: '站点信息' }
            ],
            active1:0,
            active2:-1
        };
    },
    methods:{
        setTegel(index){
            console.log(index)
            this.active1 = this.active1 == index?-1:index
            this.active2 = -1
        },
        setTegel2(index){
            this.active2 = this.active2 == index?-1:index
        }
    }
};
</script>

<style scoped>
.ul1 .li1 span{
    color: black
}
.ul2 .li2 span{
    color: red
}
.ul3 .li3 span{
    color: blue
}
.ul3_1 .li3_1 span{
    color: green
}
</style>
