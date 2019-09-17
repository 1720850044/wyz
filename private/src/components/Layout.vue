<template>
    <Form :model="formItem" :label-width="80" ref='contractForm' :rules="ruleValidate">
        <FormItem label="Input" prop="input">
            <Input v-model="formItem.input" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="Select">
            <Select v-model="formItem.select">
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
            </Select>
        </FormItem>
        <FormItem label="DatePicker">
            <Row>
                <Col span="11">
                    <DatePicker type="date" placeholder="Select date" v-model="formItem.date"></DatePicker>
                </Col>
                <Col span="2" style="text-align: center">-</Col>
                <Col span="11">
                    <TimePicker type="time" placeholder="Select time" v-model="formItem.time"></TimePicker>
                </Col>
            </Row>
        </FormItem>
        <FormItem label="Radio">
            <RadioGroup v-model="formItem.radio">
                <Radio label="male">Male</Radio>
                <Radio label="female">Female</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="Checkbox">
            <CheckboxGroup v-model="formItem.checkbox">
                <Checkbox label="Eat"></Checkbox>
                <Checkbox label="Sleep"></Checkbox>
                <Checkbox label="Run"></Checkbox>
                <Checkbox label="Movie"></Checkbox>
            </CheckboxGroup>
        </FormItem>
        <FormItem label="Switch">
            <i-switch v-model="formItem.switch" size="large">
                <span slot="open">On</span>
                <span slot="close">Off</span>
            </i-switch>
        </FormItem>
        <FormItem label="Slider">
            <Slider v-model="formItem.slider" range></Slider>
        </FormItem>
        <FormItem label="Text">
            <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem>
            <Button type="primary">Submit</Button>
            <Button style="margin-left: 8px">Cancel</Button>
        </FormItem>
        <div>
            <!-- 监听到文本框数据的改变 -->
            <input type="text" v-model="firstname">+
            <input type="text" v-model="lastname">=
            <input type="text" v-model="fullname">
        </div>
    </Form>
</template>
<script>
    export default {
        data () {
            return {
                formItem: {
                    input: '',
                    select: '',
                    radio: 'male',
                    checkbox: [],
                    switch: true,
                    date: '',
                    time: '',
                    slider: [20, 50],
                    textarea: ''
                },
                ruleValidate: {
                    input:[{ required: true, message: '合同编号不能为空', trigger: 'blur'}]
                },
                firstname: '',
                lastname: ''
            }
        },
        computed:{
            // 在 computed 中，可以定义一些属性，这些属性叫做【计算属性】，
            // 本质就是一个方法，只是使用这些计算属性的时候，是把他们的名称，
            // 之间当做属性来使用，并不会把计算属性当做方法调用；

            // 注意 1：计算属性在引用的时候，不要加小括号调用，直接当做普通属性去使用
            // 注意 2：只要计算属性，这个 function 中，所用的任何 data 中的数据发生了变化，就会
            // 立即重新计算这个计算属性的值，否则不会对计算属性从新求值
            // 注意 3：计算属性的求值结构，会被缓存起来，方便下次直接使用
            fullname:function () {
                console.log(this);
                return this.firstname+'+'+this.lastname
            }
        }
    }
</script>