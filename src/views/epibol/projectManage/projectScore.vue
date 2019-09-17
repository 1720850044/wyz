<template>
    <div style="height: 94%">
        <jia-evaluation v-if="companyType == 1"></jia-evaluation>
        <yi-evaluation v-else></yi-evaluation>
    </div>
</template>
<script>
    import Cookies from 'js-cookie';
    import JiaEvaluation from "./jiaEvaluation";
    import YiEvaluation from "./yiEvaluation";
    export default {
        data(){
            return {
                companyType: JSON.parse(Cookies.get('company')).type
            };
        },
        components: {
            YiEvaluation,
            JiaEvaluation
        }
    };
</script>
