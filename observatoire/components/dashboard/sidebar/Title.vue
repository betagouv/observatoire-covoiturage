<template>
  <div class="sidebar-title">
      <h3>{{title}}</h3>
      <p v-if="definition">
        <NuxtLink :to=definition.link target="_blank">
          <span class="fr-fi-information-line" aria-hidden="true"></span>
          {{definition.name}} 
        </NuxtLink>
      </p>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
@Component
export default class SidebarTitle extends Vue{
  @Prop({ required: true }) title!: string
  @Prop() definition!: { link:string, name:string }
}
</script>
<style lang="scss" scoped>
 .sidebar-title{
   background-color: #000091;
   padding: 20px 5px;
   h3 {
     color: #ffffff;
     text-align: center;
   }
 }
</style>