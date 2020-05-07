<template>
    <div id="tab_bar">
      <slot></slot>
    </div>
</template>

<script>
  export default{
    name:'TabBar'
  }
</script>

<style>
#tab_bar{
   display: flex;
   background-color: #F6F6F6;

   position: fixed;
   left: 0;
   bottom: 0;
   right: 0;

   box-shadow: 0 -1px 1px rgba(100,100,100,.2);
 }
 
</style>
