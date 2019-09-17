const Tool = {

}
Tool.test = function(){
    // console.log(this);
    return 'test';
}
Tool.renderTelp = function(self,data,h, params){
    //console.log(self);
    if (params.row.$isEdit) {
        return [h('Input', {
        props: {
            type: "text",
            value: params.row.name
        },
        on: {
            "on-blur": event => {
                params.row.name = event.target.value;
                if(!event.target.value){
                    data[params.index].valid = "不能为空";
                }else{
                    data[params.index].valid = "";
                self.$set(params.row, '$isEdit', false);
                }
                
            },
        }
        }),
        h(
            "span",
            {
                attrs: {
                title: params.row.valid
                },
                style: {
                color: "red"
                }
            },
            params.row.valid
        )
        ]
    } else  {  
    return h('div', {
        on: {
            click: () => {
                self.$set(params.row, '$isEdit', true);
            },                            
        }
        },params.row.name);
    }
}
export default Tool