<template>
  <div>
    <label class="fr-sidemenu__title">
      Types d'aires de covoiturage :
    </label>
    <o-field v-for="cat in this.switch" :key="cat.name">
      <o-switch size="is-small" :value="cat.active" @input="update(cat)">
        {{cat.name}}
      </o-switch>
    </o-field>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { DashboardState } from '../../../../store/dashboard'

@Component({
  computed:{
    ...mapState({
      dashboard: 'dashboard',
      helpers: 'helpers',
    })
  }
})
export default class AiresSwitch extends Vue{
  dashboard!: DashboardState

  get switch(){
    return this.dashboard.airesSwitch
  }

  public update(value:DashboardState["airesSwitch"][0]){
    const update = {name:value.name, active:!value.active}
    this.$store.commit('dashboard/AIRES_SWITCH', update)
  }
}
</script>