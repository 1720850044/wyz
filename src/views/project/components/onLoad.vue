<template>
    <div class="onLoad">
        <Row>
            <Col class="demo-spin-col" span="24">
                <Spin fix>
                    <Icon type="load-c" size=30 class="demo-spin-icon-load"></Icon>
                    <div>Loading</div>
                </Spin>
            </Col>
        </Row>
    </div>
</template>
<script>

</script>
<style>
    .onLoad{
        /*left:50%;top:45%;position:absolute*/
    }
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
</style>
