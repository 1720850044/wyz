<template>
    <div class="financialStatistics" >
        <routerlink>
            <ul slot="linkList" class="linkTab">
                <router-link tag="li" to="/epibol/mainPage/financeIndex">{{$t('companyProject.com_financeOverview')}}</router-link>
                <router-link tag="li" to="/epibol/mainPage/detailed">{{$t('companyProject.com_incomeDetails')}}</router-link>
                <router-link tag="li" to="/epibol/mainPage/expenditure">{{$t('companyProject.com_payDetails')}}</router-link>
                <router-link tag="li" to="/epibol/mainPage/financialStatistics">{{$t('companyProject.com_financialStatistics')}}</router-link>
            </ul>
        </routerlink>
        <router-view></router-view>
    </div>
</template>
<style lang="less">
    .financialStatistics {
        min-width: 1300px;
        background: @baseboard;
    }
</style>
