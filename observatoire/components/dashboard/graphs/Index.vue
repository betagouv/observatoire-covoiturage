<template>
  <section>
    
  </section>
</template>
 
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'


@Component({
  components:{
    
  },
  computed:{
    ...mapState({
      dashboard: 'dashboard',
    })
  }
})
export default class GraphIndex extends Vue{
  
}
</script>
