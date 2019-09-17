<template>
  <div>
    <Table :ref="refs" :columns="columnsList" :data="thisTableData" border disabled-hover></Table>
  </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    const editButton = (vm, h, currentRow, index) => h('Button', {
        props: {
            type: currentRow.editting ? 'success' : 'primary',
            loading: currentRow.saving
        },
        style: {
            margin: '0 5px'
        },
        on: {
            'click': () => {
                if (!currentRow.editting) {
                    if (currentRow.edittingCell) {
                        for (let name in currentRow.edittingCell) {
                            currentRow.edittingCell[name] = false;
                            vm.edittingStore[index].edittingCell[name] = false;
                        }
                    }
                    vm.edittingStore[index].editting = true;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                } else {
                    vm.edittingStore[index].saving = true;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    let edittingRow = vm.edittingStore[index];
                    edittingRow.editting = false;
                    edittingRow.saving = false;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                    vm.$emit('on-change', vm.handleBackdata(vm.thisTableData), index);
                }
            }
        }
    }, currentRow.editting ? '保存' : '编辑');
    const deleteButton = (vm, h, currentRow, index) => h('Poptip', {
        props: {
            confirm: true,
            title: '您确定要删除这条数据吗?',
            transfer: true
        },
        on: {
            'on-ok': () => {
                vm.thisTableData.splice(index, 1);
                vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                vm.$emit('on-delete', vm.handleBackdata(vm.thisTableData), index);
            }
        }
    }, [
        h('Button', {
            style: {
                margin: '0 5px'
            },
            props: {
                type: 'error',
                placement: 'top'
            }
        }, '删除')
    ]);
    const incellEditBtn = (vm, h, param) => {
        if (vm.hoverShow) {
            return h('div', {
                'class': {
                    'show-edit-btn': vm.hoverShow
                }
            }, [
                h('Button', {
                    props: {
                        type: 'text',
                        icon: 'edit'
                    },
                    on: {
                        click: (event) => {
                            vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                            vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                        }
                    }
                })
            ]);
        } else {
            return h('Button', {
                props: {
                    type: 'text',
                    icon: 'edit'
                },
                on: {
                    click: (event) => {
                        vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                        vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    }
                }
            });
        }
    };
    const saveIncellEditBtn = (vm, h, param) => h('Button', {
        props: {
            type: 'text',
            icon: 'checkmark'
        },
        on: {
            click: (event) => {
                vm.edittingStore[param.index].edittingCell[param.column.key] = false;
                vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                vm.$emit('on-cell-change', vm.handleBackdata(vm.thisTableData), param.index, param.column.key);
            }
        }
    });
    const cellInput = (vm, h, param, item) => h('Input', {
        props: {
            type: 'text',
            value: vm.edittingStore[param.index][item.key]
        },
        on: {
            'on-change' (event) {
                let key = item.key;
                vm.edittingStore[param.index][key] = event.target.value;
            }
        }
    });
    const cellSelect = (vm, h, param, item) => {
        let cellKey = item.key;
        switch (cellKey) {
            case 'tasktype_id':
                return h('Select', {
                    props: {
                        filterable: true,
                        value: vm.edittingStore[param.index][item.key].tasktype_name
                    },
                    on: {
                        'on-change' (event) {
                            let id;
                            vm.taskType.forEach((item) => {
                                if (item.tasktype) {
                                    item.tasktype.forEach((key) => {
                                        if (event == key.tasktype_name) {
                                            id = key.id;
                                        }
                                    });
                                }
                            });
                            let key = item.key;
                            vm.edittingStore[param.index][key].tasktype_name = event;
                            vm.edittingStore[param.index][key].tasktype_id = id + "";
                        }
                    }
                },
                    vm.taskType.map((item) => h('OptionGroup', {
                        props: {
                            label: item.tasktype_name
                        }
                    }, !item.tasktype ? [] : item.tasktype.map((label) => h('Option', {
                        props: {
                            value: label.id,
                            label: label.tasktype_name
                        }
                    }))))
                );
                break;
            case 'project_child':
                return h('Select', {
                    props: {
                        filterable: true,
                        value: vm.edittingStore[param.index][item.key].project_child_name
                    },
                    on: {
                        'on-change' (event) {
                            let id;
                            vm.subProjectList.forEach((item) => {
                                if (event == item.name) {
                                    id = item.id;
                                }
                            });
                            let key = item.key;
                            vm.edittingStore[param.index][key].project_child_name = event;
                            vm.edittingStore[param.index][key].project_child_id = id + "";
                        }
                    }
                },
                    vm.subProjectList.map((item) => h('Option', {
                        props: {
                            value: item.name,
                            label: item.name
                        }
                    }))
                );
                break;
            case 'run_member_id':
                return h('Select', {
                    props: {
                        filterable: true,
                        value: vm.edittingStore[param.index][item.key].remark_name
                    },
                    on: {
                        'on-change' (event) {
                            let id;
                            vm.memberdata.forEach((item) => {
                                if (event == item.remark_name) {
                                    id = item.id;
                                }
                            });
                            let key = item.key;
                            vm.edittingStore[param.index][key].remark_name = event;
                            vm.edittingStore[param.index][key].member_id = id + "";
                        }
                    }
                },
                    vm.memberdata.map((item) => h('Option', {
                        props: {
                            value: item.remark_name,
                            label: item.remark_name
                        }
                    }))
                );
                break;
        }
    };
    const cellDatePicker = (vm, h, param, item) => h('div', [　　h('DatePicker', {
        props: {
            type: 'daterange',
            format: 'yyyy-MM-dd',
            placeholder: '选择日期范围',
            value: param.row.pubdate
        },
        style: {
            marginRight: '5px'
        },
        on: {
            'on-change': (val) => {
                vm.edittingStore[param.index].expect_start_time = val[0];
                vm.edittingStore[param.index].expect_end_time = val[1];
            }
        }
    })　]);
    export default {
        name: 'canEditTable',
        props: {
            refs: String,
            columnsList: Array,
            value: Array,
            // url: String,
            editIncell: {
                type: Boolean,
                default: false
            },
            hoverShow: {
                type: Boolean,
                default: false
            },
            // cellType: {
            //     type: String,
            //     default: ''
            // }
        },
        data() {
            return {
                columns: [],
                thisTableData: [],
                edittingStore: [],
                memberdata: []
            };
        },
        created() {
            this.getTaskList();
            this.getSubProject(sessionStorage.projectID);
            this.deptFData();
            this.init();
        },
        computed: {
            ...mapGetters({
                taskType: 'getTaskType',
                subProjectList: 'getSubProjectList',
                deptLComId: 'getDeptLFComId',
                deptLdeptId: 'getDeptLFdeptId',
            })
        },
        methods: {

            /**
             * 从store中把任务类型获取出来
             */
            getTaskList() {
                let data = {project_id: 1};
                this.$store.dispatch('fetchTaskList', data);
            },
            getSubProject(pId) {
                let data = {id: pId};
                this.$store.dispatch('fetchSubProject', data);
            },
            deptFData() {
                let data = {
                    company_id: this.deptLComId
                };
                this.$axios.post(this.GLOBAL.baseRouter+this.$GLOBALAPI.task_member_page, data)
                    .then(res => res.data)
                    .then(res => {
                        if (res.err_code == 0) {
                            this.pageSize = res.page.page_size;
                            this.allData = res.data;
                            if (this.allData <= this.pageSize) {
                                this.memberdata = this.allData;
                            } else {
                                this.memberdata = this.allData.slice(0, this.pageSize);
                            }
                            this.count = parseInt(res.page.count);
                        } else {
                            this.$Message.error('数据请求发生错误！');
                        }
                    });
            },
            init() {
                let vm = this;
                let editableCell = this.columnsList.filter(item => {
                    if (item.editable) {
                        return item;
                    }
                });
                let cloneData = this.value;

                cloneData.forEach((item) => {
                    if (item.project_child) {
                        item.project_child = item.project_child.project_child_id;
                    }
                    if (item.run_member_id) {
                        item.run_member_id = item.run_member_id.member_id;
                    }
                    if (item.tasktype_id) {
                        item.tasktype_id = item.tasktype_id.tasktype_id;
                    }
                });
                sessionStorage.excelJson = JSON.stringify(cloneData); // 批量上传所需要的表格中的JSON格式的数据
                let res = [];
                res = cloneData.map((item, index) => {
                    let isEditting = false;
                    if (this.thisTableData[index]) {
                        if (this.thisTableData[index].editting) {
                            isEditting = true;
                        } else {
                            for (const cell in this.thisTableData[index].edittingCell) {
                                if (this.thisTableData[index].edittingCell[cell] === true) {
                                    isEditting = true;
                                }
                            }
                        }
                    }

                    if (isEditting) {
                        return this.thisTableData[index];
                    } else {
                        this.$set(item, 'editting', false);
                        let edittingCell = {};
                        editableCell.forEach(item => {
                            edittingCell[item.key] = false;
                        });
                        this.$set(item, 'edittingCell', edittingCell);
                        return item;
                    }
                });
                this.thisTableData = res;
                this.edittingStore = JSON.parse(JSON.stringify(this.thisTableData));
                this.columnsList.forEach(item => {
                    if (item.editable) {
                        let cellType = item.cellType;
                        switch (cellType) {
                            case "input":
                                item.render = (h, param) => {
                                    let currentRow = this.thisTableData[param.index];
                                    if (!currentRow.editting) {
                                        let cellValue = currentRow[item.key];
                                        if (cellValue == "") {
                                            cellValue = "暂无数据";
                                        }
                                        if (this.editIncell) {
                                            return h('Row', {
                                                props: {
                                                    type: 'flex',
                                                    align: 'middle',
                                                    justify: 'center'
                                                }
                                            }, [
                                                h('Col', {
                                                    props: {
                                                        span: '22'
                                                    }
                                                }, [!currentRow.edittingCell[param.column.key] ? h('span', cellValue) : cellInput(this, h, param, item)]),
                                                h('Col', {
                                                    props: {
                                                        span: '2'
                                                    }
                                                }, [
                                                    currentRow.edittingCell[param.column.key] ? saveIncellEditBtn(this, h, param) : incellEditBtn(this, h, param)
                                                ])
                                            ]);
                                        } else {
                                            return h('span', currentRow[item.key]);
                                        }
                                    } else {
                                        return h('Input', {
                                            props: {
                                                type: 'text',
                                                value: currentRow[item.key]
                                            },
                                            on: {
                                                'on-change' (event) {
                                                    let key = param.column.key;
                                                    vm.edittingStore[param.index][key] = event.target.value;
                                                }
                                            }
                                        });
                                    }
                                };
                                break;
                            case "select":
                                // console.log(item)
                                item.render = (h, param) => {
                                    // console.log(param)
                                    // console.log(this.thisTableData[param.index])
                                    let currentRow = this.thisTableData[param.index];
                                    // console.log(currentRow)
                                    if (!currentRow.editting) {
                                        let cellKey = item.key;
                                        let cellValue = currentRow[item.key];
                                        // console.log(item.key +':'+ cellValue)

                                        switch (cellKey) {
                                            case 'project_child':
                                                if (currentRow.project_child) {
                                                    cellValue = currentRow.project_child.project_child_name;
                                                } else {
                                                    cellValue = "暂无数据";
                                                }
                                                break;
                                            case 'tasktype_id':
                                                if (currentRow.tasktype_id) {
                                                    cellValue = currentRow.tasktype_id.tasktype_name;
                                                } else {
                                                    cellValue = "暂无数据";
                                                }
                                                break;
                                            case 'run_member_id':
                                                if (currentRow.run_member_id) {
                                                    cellValue = currentRow.run_member_id.remark_name;
                                                } else {
                                                    cellValue = "暂无数据";
                                                }
                                                break;
                                            default:
                                                cellValue = "暂无数据";
                                                break;
                                        }

                                        if (this.editIncell) {
                                            return h('Row', {
                                                props: {
                                                    type: 'flex',
                                                    align: 'middle',
                                                    justify: 'center'
                                                }
                                            }, [
                                                h('Col', {
                                                    props: {
                                                        span: '22'
                                                    }
                                                },
                                                    // [cellSelect(this, h, param, item)]),
                                                    [!currentRow.edittingCell[param.column.key] ? h('span', cellValue) : cellSelect(this, h, param, item)]),
                                                h('Col', {
                                                    props: {
                                                        span: '2'
                                                    }
                                                }, [
                                                    currentRow.edittingCell[param.column.key] ? saveIncellEditBtn(this, h, param) : incellEditBtn(this, h, param)
                                                ])
                                            ]);
                                        } else {
                                            return h('span', currentRow[item.key]);
                                        }
                                    } else {
                                        return h('Input', {
                                            props: {
                                                type: 'text',
                                                value: currentRow[item.key]
                                            },
                                            on: {
                                                'on-change' (event) {
                                                    let key = param.column.key;
                                                    vm.edittingStore[param.index][key] = event.target.value;
                                                }
                                            }
                                        });
                                    }
                                };
                                break;
                            case 'datePicker':
                                item.render = (h, param) => {
                                    let currentRow = this.thisTableData[param.index];
                                    if (!currentRow.editting) {
                                        let cellValue = currentRow[item.key];
                                        if (cellValue == "" || cellValue == null) {
                                            cellValue = "暂无数据";
                                        }
                                        if (this.editIncell) {
                                            return h('Row', {
                                                props: {
                                                    type: 'flex',
                                                    align: 'middle',
                                                    justify: 'center'
                                                }
                                            }, [
                                                h('Col', {
                                                    props: {
                                                        span: '22'
                                                    }
                                                }, [!currentRow.edittingCell[param.column.key] ? h('span', cellValue) : cellDatePicker(this, h, param, item)]),
                                                h('Col', {
                                                    props: {
                                                        span: '2'
                                                    }
                                                }, [
                                                    currentRow.edittingCell[param.column.key] ? saveIncellEditBtn(this, h, param) : incellEditBtn(this, h, param)
                                                ])
                                            ]);
                                        } else {
                                            return h('span', currentRow[item.key]);
                                        }
                                    } else {
                                        return h('Input', {
                                            props: {
                                                type: 'text',
                                                value: currentRow[item.key]
                                            },
                                            on: {
                                                'on-change' (event) {
                                                    let key = param.column.key;
                                                    vm.edittingStore[param.index][key] = event.target.value;
                                                }
                                            }
                                        });
                                    }
                                };
                                break;
                        }
                    }
                    if (item.handle) {
                        item.render = (h, param) => {
                            let currentRowData = this.thisTableData[param.index];
                            let children = [];
                            item.handle.forEach(item => {
                                if (item === 'edit') {
                                    children.push(editButton(this, h, currentRowData, param.index));
                                }
                                //  else if (item === 'delete') {
                                //     children.push(deleteButton(this, h, currentRowData, param.index));
                                // }
                            });
                            return h('div', children);
                        };
                    }
                });
            },
            handleBackdata(data) {
                let clonedData = JSON.parse(JSON.stringify(data));
                clonedData.forEach(item => {
                    delete item.editting;
                    delete item.edittingCell;
                    delete item.saving;
                });
                return clonedData;
            }
        },
        watch: {
            value(data) {
                // this.init();
            }
        }
    };
</script>
<style lang="less">
@import 'style/editable-table.less';
.ivu-table-cell {
  overflow: inherit !important;
}
.ivu-select-dropdown{
  text-align: left !important;
}
</style>
