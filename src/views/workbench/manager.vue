<template>
    <div>
        <routerlink>
            <ul slot="linkList" class="linkTab">
                <router-link tag="li" to="/workbench/manager/entiretyOverview">{{$t('workbench.work_entiretyOverview')}}</router-link>
                <router-link tag="li" to="/workbench/manager/workOverview">{{$t('workbench.work_workOverview')}}</router-link>
                <!--<router-link tag="li" to="/workbench/manager/financeOverview">{{$t('workbench.work_financeOverview')}}</router-link>-->
                <router-link tag="li" to="/workbench/manager/memberOverview">{{$t('workbench.work_memberOverview')}}</router-link>
            </ul>
        </routerlink>
        <router-view></router-view>
    </div>
</template>
<script>

</script>




