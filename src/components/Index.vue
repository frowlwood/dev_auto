<template>
  <div class="index-content">
    <div class="menu-content-box">
      <dev-menu></dev-menu>
    </div>
    <div class="right-content-box">
      <router-view/>
    </div>
    <span class="clear-float"></span>
  </div>
</template>

<script>
import DevMenu from '@/components/DevMenu.vue'

export default {
  name: 'Index',
  components: {DevMenu},
  data () {
    return {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .index-content{
    display: flex;
    flex-direction: row;
    min-height: 100vh;

  }
  .menu-content-box {
    width: 240px;
    border-right: 1px solid #dddddd;
  }
.right-content-box{
  width: 100%;
  background-color: #EEEEEE;
  min-height: 120vh;
}

</style>
