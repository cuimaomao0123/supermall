<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <!-- 注意组件props里是驼峰，父组件调用要传参数用-分割 probe-type -->
    <tab-control :titles="['流行','新款','精选']"
    @tabClick="tabClick" ref="tabControl1"
    class="tab-control" v-show="isTabFixed"/>

    <scroll class="content"
     ref="scroll"
      :probe-type="3"
       @scroll="contentScroll"
       :pull-up-load="true"
       @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view></feature-view>
      <tab-control :titles="['流行','新款','精选']"
      @tabClick="tabClick" ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <!-- //组件没法直接监听事件，要点击得加上native -->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'

  import {getHomeMultidata,getHomeGoods} from 'network/home'
  import {debounce} from 'common/utils.js'



  export default{
    name:'Home',
    components:{
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    data(){
      return {
        banners:[],
        recommends:[],
        goods:{
          'pop':{page: 0,list: []},
          'new':{page: 0,list: []},
          'sell':{page: 0,list: []}
        },
        currentType:'pop',
        isShowBackTop:false,
        tabOffsetTop:0,
        isTabFixed:false,
        saveY:0
      }
    },
    created(){
      //1、请求多个数据(这个this如果不写，会调用上面导入进来的函数)
      this.getHomeMultidata()
      //2、请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted(){
      //监听item里图片加载完成
      const refresh = debounce(this.$refs.scroll.refresh,50)
      this.$bus.$on('itemImageLoad',() => {
        refresh()
      })
    },
    activated(){
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated(){
      this.saveY = this.$refs.scroll.getScrollY()
    },

  methods:{
    /*
    * 事件监听相关方法
    */

    tabClick(index){
      switch(index){
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    backClick(){
      // (&&前面是为了防止scroll实例还没创建好就调用,而报错)
      this.$refs.scroll.scroll && this.$refs.scroll.scroll.scrollTo(0,0,500)
    },
    contentScroll(position){
      //1、判断backtop是否显示
      this.isShowBackTop = (-position.y) > 1000
      //2、决定tabcontrol是否吸顶
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore(){
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad(){
      //获取tabControl的offsetTop
      //组件是没有这个属性的，元素才有
      //所有组件都有一个属性叫做$el：用于获取组件中的元素
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },
    /*
    * 网络请求相关方法
    */
    getHomeMultidata(){
      getHomeMultidata().then(res => {
        // console.log(res)
        // this.result = res;
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      }).catch(err => {
        console.log(err)
      })
    },
    getHomeGoods(type){
      const page = this.goods[type].page + 1
      getHomeGoods(type,page).then(res => {
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1

        this.$refs.scroll.scroll.finishPullUp()
      })
    }
  }
 }
</script>

<style scoped>
  #home{
    height: 100vh;
    position: relative;
    /* padding-top: 44px; */
  }
  .home-nav{
    background-color: var(--color-tint);
    color: #fff;
  /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }
  .tab-control{
    position: relative;
    z-index: 9;
  }
/*  .tab-control{
    position: sticky;
    top: 44px;  现在无效了
    z-index: 9;
  } */
  /* .content{
    margin-top: 44px;
    height: calc(100% - 93px);
  } */
  .content{
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
    overflow: hidden;
  }
  /* .fixed{
    padding: fixed;
    left: 0; 无法停留，better-scroll内部的translate一直在改变
    right: 0;
    top: 44px;
  } */
</style>
