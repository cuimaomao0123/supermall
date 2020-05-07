<template>
  <div id="detail">
    <detail-nav-bar/>
    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo"
      @imageLoad="imageLoad"/>
      <detail-param-info :param-info="paramInfo"/>
    </scroll>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'

  import Scroll from 'components/common/scroll/Scroll'

  import {getDetail,Goods,Shop,GoodsParam} from 'network/detail'

  export default{
    name:'Detail',
    components:{
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      Shop,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo
    },
    data(){
      return {
        iid:null,
        topImages:[],
        goods:{},
        shop:{},
        detailInfo:{},
        paramInfo:{}
      }
    },
    created(){
      //1、保存传入的iid
      this.iid = this.$route.params.iid

      //2、根据iid请求详情数据
       getDetail(this.iid).then(res => {
         // console.log(res)
         const data = res.result
         this.topImages = data.itemInfo.topImages
         //3、获取商品信息
         this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
         //4、获取店铺信息对象
         this.shop = new Shop(data.shopInfo)
         //5、保存商品的详情数据
         this.detailInfo = data.detailInfo
         //5、获取参数的信息
         this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
       })
    },
    methods:{
      imageLoad(){
        // console.log(111)
        this.$refs.scroll.scrollTo(0,0,0)
        this.$refs.scroll.refresh()
      }
    }
  }
</script>

<style scoped>
  #detail{
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .content{
    height: calc(100% - 44px);
  }
</style>
