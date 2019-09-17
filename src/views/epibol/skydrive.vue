<template>
    <div>
        <main-native>
            <div class="main-header-style"><span class="main-header-title">{{this.$route.meta.title}}<div></div></span></div>
        </main-native>
        <div class="skyDriveContent" id="skyDriveContent">
            <div class="skyDriveTop">
                <div class="DriveRow1">
                    <div class="left">
                        <!--v-if="CatalogRoute.length > 1"-->
                        <span class="iconfonts icon-fangxiangshang" v-for="(item,index) in CatalogRoute" @click="enterFolderFunction(0,item,index)">{{item.name}}</span>
                    </div>
                    <div class="right">
                        <Input v-model="fileterObj.key" icon="ios-search" :placeholder="resFolder" style="width: 180px" @keyup.enter.native="getresourceList('search')"></Input>
                        <!--<button :disabled="newNameFlag" @click="spaceModel=true">空间管理</button>-->
                        <button v-if="btnsFlag.deletedlist" :disabled="newNameFlag" @click="recoveryListFun" id="restoreResource">{{$t('resources.res_restoreResources')}}</button>.
                        <button v-if="btnsFlag.mkdir" :disabled="newNameFlag" @click="newfolder">{{$t('resources.res_createFolder')}}</button>
                        <button v-if="btnsFlag.upload" :disabled="newNameFlag" id="skyFile">{{$t('workbench.work_uploadFeilText')}}</button>
                        <button v-if="btnsFlag.upload" :disabled="newNameFlag" id="skyFolder">{{$t('upload.upload_uploadFolder')}}</button>
                        <template v-if="btnsFlag.upload">
                            <upload-operate v-show="false" :uploadId="'resourceUp'" :parentFolder="creentCatalogID" @returnSuccessData="getresourceList" :skyDrive="skyUploadArr"></upload-operate>
                        </template>
                    </div>
                </div>
                <div class="DriveRow2">
                    <div class="left">
                        <p class="actionItem" v-if="selectAll.showFlag">
                            <Checkbox v-model="selectAll.checkedFlag" @on-change="selectAllFun()">
                                <label>{{$t('resources.res_haveChosen')}} <b style="color: #3cd2b4;">{{selectAll.number}}</b> {{$t('project.pro_items')}}</label>
                            </Checkbox>
                            <span v-if="btnsFlag.pickzip" class="iconfonts icon-xiazai" @click="downloadFile(0)">{{$t('upload.upload_download')}}</span>
                            <span v-if="btnsFlag.move" class="iconfonts icon-source-move"  @click="copyOrmoveFunction($event,0)">{{$t('lang.lang_move')}}</span>
                            <span v-if="btnsFlag.copy" class="iconfonts icon-sourceCope"  @click="copyOrmoveFunction($event,1)">{{$t('lang.lang_copy')}}</span>
                            <span v-if="btnsFlag.delete" class="iconfonts icon-sourceDel" @click="deletFunction(null,0)">{{$t('lang.lang_delete')}}</span>
                        </p>
                    </div>
                    <div class="right">
                        <p class="selectP">
                            <!--<span>资源:&nbsp;&nbsp;&nbsp;</span>-->
                            <Select v-model="fileterObj.attr" :disabled="newNameFlag" style="width:115px" @on-change="changeList">
                                <Option value='null'>{{$t('resources.res_allResourceTypes')}}</Option>
                                <Option v-for="item in resourceList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </p>
                    </div>
                </div>
            </div>
            <div class="skyDriveList">
                <div v-if="loadingFlag" style="height: 690px">
                    <loading></loading>
                </div>
                <ul v-if="!loadingFlag && (folderList && folderList.length > 0)" class="skyDriveUl">
                    <li v-for="(item,index) in folderList" v-if="item.type == 'folder'" class="skyDriveLi folder" :class="{'checkedSty':item.selectionFlag}" >
                        <Checkbox :disabled="newNameFlag" class="checkbox" v-model="item.selectionFlag" @on-change="changeStatus(item)"></Checkbox>
                        <span class="tag" v-if="item.tag === 1">{{$t('lang.lang_project')}}</span>
                        <i class="iconfonts icon-shenglve-"  @click="showToolTip($event,item)"></i>
                        <div class="tooltip" v-if="item.tooltipFlag" ref="tooltip">
                            <ul>
                                <li v-if="btnsFlag.pickzip" @click="downloadFile(1,item)"><span class="iconfonts icon-xiazai">{{$t('upload.upload_download')}}</span></li>
                                <li v-if="btnsFlag.move" @click="copyOrmoveFunction($event,0,item)"><span class="iconfonts icon-source-move">{{$t('lang.lang_move')}}</span></li>
                                <li v-if="btnsFlag.copy" @click="copyOrmoveFunction($event,1,item)"><span class="iconfonts icon-sourceCope">{{$t('lang.lang_copy')}}</span></li>
                                <li v-if="btnsFlag.rename" @click="editerName(item)"><span class="iconfonts icon-bianji">{{$t('resources.res_rename')}}</span></li>
                                <li v-if="btnsFlag.delete" @click="deletFunction(item,0)"><span class="iconfonts icon-sourceDel">{{$t('lang.lang_delete')}}</span></li>
                            </ul>
                        </div>
                        <!--v-if="item.copyMoveFlag"-->
                        <!--<div class="moveAndCopy" v-if="item.copyMoveFlag" >-->
                            <!--<div class="head">选择移动目录</div>-->
                            <!--<div class="copyOrmoveRouter">-->
                                <!--<span  class="iconfonts icon-fangxiangshang">公司资源</span>-->
                                <!--<span  class="iconfonts icon-fangxiangshang">公司资源</span>-->
                                <!--<span  class="iconfonts icon-fangxiangshang">公司资源</span>-->
                            <!--</div>-->
                            <!--<ul class="copyOrmoveUl">-->
                                <!--<li>-->
                                    <!--<i class="iconfonts icon-source-folder"></i> &nbsp;项目项目有-->
                                <!--</li>-->
                                <!--<li>-->
                                    <!--<i class="iconfonts icon-source-folder"></i> &nbsp;项目项目有-->
                                <!--</li>-->
                                <!--<li>-->
                                    <!--<i class="iconfonts icon-source-folder"></i> &nbsp;项目项目有-->
                                <!--</li>-->
                                <!--<li>-->
                                    <!--<i class="iconfonts icon-source-folder"></i> &nbsp;项目项目有-->
                                <!--</li>-->
                            <!--</ul>-->
                        <!--</div>-->

                        <div class="boxSty" @click="enterFolderFunction(1,item,index)" :title="item.name">
                            <img class="folderIcon" src="../../assets/images/folderIcon.png" style="margin-top: 10px"/>
                            <p class="folderName">
                                <input v-if="item.editFlag" :value="item.name" @keyup.enter="$event.target.blur" ref="inputVal" @blur="saveName($event,item,index)" @click="$event.stopPropagation()"/>
                                <span v-else :title="item.name">{{item.name}}</span>
                            </p>
                        </div>
                    </li>
                    <li v-for="(item,index) in folderList" v-if="item.type == 'file'" class="skyDriveLi file" :class="{'checkedSty':item.selectionFlag}"  >
                        <Checkbox :disabled="newNameFlag" class="checkbox" v-model="item.selectionFlag" @on-change.capture="changeStatus(item)"></Checkbox>
                        <span class="tag" v-if="item.tag && resourceList.length > 0">
                            {{
                                resourceList.filter((creent) =>{return creent.id == item.tag})[0].name || null
                            }}
                        </span>
                        <span class="tag" v-else-if="!item.tag && (item.extension === 'fbx'|| item.extension === 'obj'|| item.extension === '3ds')">3D</span>
                        <i class="iconfonts icon-shenglve-" @click="showToolTip($event,item)"></i>
                        <div class="tooltip"  v-if="item.tooltipFlag" ref="tooltip">
                            <ul>
                                <li v-if="btnsFlag.pickzip"  @click="downloadFile(1,item)"><span class="iconfonts icon-xiazai">{{$t('upload.upload_download')}}</span></li>
                                <li v-if="btnsFlag.move" @click="copyOrmoveFunction($event,0,item)"><span class="iconfonts icon-source-move">{{$t('lang.lang_move')}}</span></li>
                                <li v-if="btnsFlag.copy" @click="copyOrmoveFunction($event,1,item)"><span class="iconfonts icon-sourceCope">{{$t('lang.lang_copy')}}</span></li>
                                <!--<li v-if="btnsFlag.rename" @click="editerName(item)"><span class="iconfonts icon-bianji">重命名</span></li>-->
                                <li v-if="btnsFlag.delete" @click="deletFunction(item,0)"><span class="iconfonts icon-sourceDel">{{$t('lang.lang_delete')}}</span></li>
                            </ul>
                        </div>

                        <div class="boxSty" @click="lookdetails(item)" :title="item.name">
                            <div class="filePic">
                                <img v-if="item.extension === 'mp4' || item.extension === 'MP4'" :src="item.url+'?x-oss-process=video/snapshot,t_1000,f_jpg,w_165,h_142,m_fast'"/>
                                <img v-else-if="(item.extension === 'fbx'|| item.extension === 'obj' || item.extension === '3ds') && !item.thumb" src="../../assets/images/3D.png"/>
                                <img v-else-if="(item.extension === 'fbx'|| item.extension === 'obj' || item.extension === '3ds') && item.thumb" :src="item.thumb"/>
                                <img v-else-if="item.extension === 'Unknown' " src="../../assets/images/UnknownIcon.png"/>
                                <img v-else :src="item.url+'?x-oss-process=style/tw'"/>
                            </div>


                            <p class="folderName">
                                <input v-if="item.editFlag" :value="item.name" @keyup.enter="saveName($event,item,index)" ref="inputVal" @blur="saveName($event,item,index)"/>
                                <span v-else :title="item.name">{{item.name}}</span>
                            </p>
                        </div>
                    </li>
                </ul>
                <div v-if="!loadingFlag && folderList.length == 0" style="position: relative;min-height: 690px">
                    <nothink type="project" :text="noDocuments"></nothink>
                </div>
            </div>
        </div>
        <!--删除提示-->
        <Modal v-model="deleteModel.flag" class="deleteModel" :title="confirmReduce" @on-ok="confirmDel">
            <div class="deleteContent">
                <p>{{$t('lang.lang_delete')}}<i>{{deleteModel.size}}</i>{{$t('resources.res_select')}}</p>
                <p v-if="deleteModel.type">{{$t('resources.res_deleteProject')}}</p>
            </div>
        </Modal>
        <!--移动、复制-->
        <Modal class="copyOrmoveModal" v-model="copyOrmove.flag" width="550" :title="copyOrmove.title+resTo">
            <div class="copyOrmoveRouter">
                <span  class="iconfonts icon-fangxiangshang"  v-for="(item,index) in copyOrmoveCatalogRoute.creentRouter" @click="getfolderCatalog(0,item,index)" :key="index">{{item.routerName}}</span>
            </div>
            <ul class="copyOrmoveUl">
                <li v-for="(item,index) in copyOrmoveCatalogRoute.CatalogChild" v-if="item.type == 'folder'" @click="getfolderCatalog(1,item,index)" :key="index">
                    <i class="iconfonts icon-source-folder"></i> &nbsp;{{item.name}}
                </li>
            </ul>
            <div slot="footer" class="copyOrMoveSty">
                <button @click="copyOrmove.flag = false">{{$t('lang.lang_cancel')}}</button>
                <button :disabled="moveBtnFlag" :class="{'disabledSty':moveBtnFlag}" @click="copyOrmoveDataFunction()">{{copyOrmove.button}}</button>
            </div>
        </Modal>
        <!--空间管理-->
        <Modal v-model="spaceModel" :title="spaceManagement">
            <div>
                <!--<p>删除<i>3</i>个选择项？</p>-->
                <!--<p>说明：删除后可在项目资源文件夹进行恢复</p>-->
            </div>
            <div slot="footer" class="spaceModelFooter">
                <button>{{$t('resources.res_extend')}}</button>
            </div>
        </Modal>
        <!--资源恢复-->
        <Modal class="recoveryModal" v-model="recoveryModel" width="550" :title="projectResourceRecovery" :footer-hide="true">
            <p class="tips"><i>!</i> {{$t('resources.res_recoveryDele')}}</p>
            <p class="thead">
                <span>{{$t('resources.res_projectFolder')}}</span>
                <span>{{$t('resources.res_deleDate')}}</span>
                <span>{{$t('workbench.work_operationTag')}}</span>
            </p>
            <div class="recoveryList">
                <ul>
                    <li v-for="item in recoveryList">
                        <span>{{item.name}}</span>
                        <span>{{item.create_time | coverTime}}</span>
                        <span>
                            <i v-if="item.is_delete==1" @click="recoveryFolder(item)">{{$t('resources.res_recovery')}}</i>
                            <span v-else-if="item.is_delete==0">{{$t('resources.res_recoveryHand')}}</span>
                            <span v-else-if="item.is_delete==2">{{$t('resources.res_recoverySuccess')}}</span>
                            <span style="color: #f44336" v-else-if="item.is_delete==3">{{$t('resources.res_recoveryFail')}}</span>
                        </span>
                    </li>
                </ul>
            </div>

        </Modal>
        <!--查看资源文件-->
        <resource-preview v-if="lookFile" @Skyscreenshot="Skyscreenshot" @deleteCurrentFile="CurrentdeleteFile" @copyCurrentFile="CurrentCallbackFun($event,1)" @moveCurrentFile="CurrentCallbackFun($event,0)" :needShowParams="creentDetail" @closePreviewModal="lookFile = false"></resource-preview>
        <upload-download-modal v-if="showDownloadPage" :initModalParams="toDownloadParams" @closeModal="showDownloadPage=false"></upload-download-modal>
    </div>
</template>
<script>
    import {ksydrive} from 'api';
    import mainNative from "../main-components/mainNative.vue";
    import ResourcePreview from "../../components/resourceManagement/resourcePreview";
    import UploadOperate from "../../components/resourceManagement/uploadOperate";
    import UploadDownloadModal from "../../components/resourceManagement/uploadDownloadModal";
    export default {
        name: "skydrive",
        components: {
            UploadOperate,
            ResourcePreview,
            mainNative,
            UploadDownloadModal
        },
        data(){
            return {
                showChildren: false,
                resFolder: i18n.t('resources.res_folder'),
                noDocuments: i18n.t('resources.res_noDocuments'),
                confirmReduce: i18n.t('companySetUp.setUp_confirmReduce'),
                resTo: i18n.t('resources.res_to'),
                spaceManagement: i18n.t('resources.res_spaceManagement'),
                projectResourceRecovery: i18n.t('resources.res_projectResourceRecovery'),
                showChildrenID: null,
                showDownloadPage: false,
                toDownloadParams: {
                    type: 'download'
                },
                lookFile: false,
                selectAll: {
                    showFlag: false,
                    checkedFlag: false,
                    number: 0
                },
                newNameFlag: false,
                recoveryModel: false,
                spaceModel: false,
                copyOrmove: {
                    flag: false,
                    title: null,
                    button: null,
                    type: null
                },
                deleteModel: {
                    flag: false,
                    size: 0,
                    type: null
                },
                folderList: [
                    // {
                    //     id:1,
                    //     name:'完美世界',     //文件夹名称
                    //     type:'folder',      //folder文件夹  file文件
                    //     editFlag:false,     //编辑开关
                    //     checkFlag:false,     //选中开关
                    //     url:null,           //文件路径
                    //     filename:null,      //文件名
                    //     project:null,       //所属项目
                    //     tag:1               //0自建文件夹1系统文件夹2文件类型
                    // }
                ],
                //文件夹路径
                CatalogRoute: [
                    {name: i18n.t('workbench.work_resourceManagement'), id: 0}
                ],
                //页面按钮显影开关
                btnsFlag: {
                    copy: 0,
                    delete: 0,
                    pickzip: 0,
                    mkdir: 0,
                    move: 0,
                    rename: 0,
                    deletedlist: 0,
                    upload: 0,
                },
                resourceList: [],
                orderList: {
                    list: [
                        {label: i18n.t('resources.res_news'), value: 'new'},
                        {label: i18n.t('resources.res_earliest'), value: 'old'}
                    ],
                    creentIndex: 0
                },
                //过滤条件
                fileterObj: {
                    page: 1,
                    page_size: 45,
                    page_total: 0,
                    attr: 'null',
                    key: null,
                    order: 'new',
                    fid: 0
                },
                //当前文件详情
                creentDetail: {
                    // fileName: '黯然销魂掌-动作',
                    // producer: '杨过过',
                    // headImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547524583&di=dffe44584e97c2fad610ebe6a1affe0d&imgtype=jpg&er=1&src=http%3A%2F%2Fimgtu.lishiquwen.com%2F20160916%2F59bef9eb9e83035792360ad72cee6e63.jpg',
                    // updateDate: '2019.1.8 11:58:58',
                    // projectName: '神雕侠侣',
                    // fileUrl: '',
                    // fileList: [
                        // {file: ''},
                        // {file: ''},
                        // {file: ''}
                    // ]
                },
                //移动复制操作文件夹目录
                copyOrmoveStatus: null,
                copyOrmoveCheckIndex: 0,
                cationData: [],
                copyOrmoveCatalogRoute: {
                    creentRouter: [
                        {
                            routerName: i18n.t('workbench.work_resourceManagement'),
                            id: 0
                        }
                    ],
                    CatalogChild: []
                },
                moveBtnFlag: false,
                //当前目录ID   默认0为根目录
                creentCatalogID: 0,
                //恢复列表
                recoveryList: [],
                //下载所需传递acc_token
                acc_token: null,
                skyUploadArr: ['skyFile', 'skyFolder'],
                loadingFlag: true
            };
        },
        methods: {
            // 气泡引导逻辑
            bubble(){
                let text = this.$lau.bubble.resourceGuide;
                this.$nextTick(() => {
                    let guideOptions = [{
                        id: 'menuContainer',
                        position: 'right',
                        title: text[0].title,
                        content: text[0].content,
                        relative: 'body',
                        subClassName: 'ivu-menu-item-selected'
                    },
                    {
                        id: 'restoreResource',
                        position: 'bottom',
                        title: text[1].title,
                        content: text[1].content,
                        relative: 'body',
                    },
                    {
                        id: 'downloadIcon',
                        position: 'bottom',
                        title: text[2].title,
                        content: text[2].content,
                        relative: 'body',
                    }];
                    setTimeout(() => {
                        this.$bubble(guideOptions);
                    }, 200);
                });
            },
            CurrentdeleteFile(){
                this.deletFunction(this.creentDetail, 1);
            },
            //删除操作
            deletFunction(item, type){
                this.deleteModel.flag = true;
                let folderList = this.folderList;
                let arr = null;
                if (type){
                    arr = [];
                    arr = [item];
                } else {
                    if (item){
                        folderList.forEach(creent =>{
                            creent.selectionFlag = false;
                        });
                        item.selectionFlag = true;
                        arr = [];
                        arr = [item];
                        this.deleteModel.type = !!parseInt(item.tag);
                    } else {
                        arr = [];
                        let ishaveProjrct = false;
                        let arrArr = folderList.filter(function (creent) {
                            if (creent.selectionFlag == true){
                                return creent;
                            }
                        });
                        arrArr.forEach(item =>{
                            if (item.tag == 1){
                                ishaveProjrct = true;
                            }
                        });
                        if (ishaveProjrct){
                            this.deleteModel.type = true;
                        } else {
                            this.deleteModel.type = false;
                        }
                        arr = arrArr;
                    }
                }

                if (arr.length > 0){
                    this.selectAll.showFlag = true;
                    this.selectAll.number = arr.length;
                    if (arr.length == folderList.length){
                        this.selectAll.checkedFlag = true;
                    } else {
                        this.selectAll.checkedFlag = false;
                    }
                    this.deleteModel.size = arr.length;
                    this.cationData = [];
                    this.cationData = arr;
                } else {
                    this.selectAll.showFlag = false;
                }
            },
            //全选操作
            selectAllFun(){
                let flag = this.selectAll.checkedFlag;
                let folderList = this.folderList;
                let _this = this;
                if (flag){
                    //全选
                    folderList.forEach(function (creent) {
                        creent.selectionFlag = true;
                    });
                    this.selectAll.number = folderList.length;
                } else {
                    //全不选
                    folderList.forEach(function (creent) {
                        creent.selectionFlag = false;
                        _this.selectAll.showFlag = false;
                    });
                }
            },
            //选择操作
            changeStatus(item){
                if (this.newNameFlag){
                    return false;
                } else {
                    // if(!item.selectionFlag){
                    //     this.selectAll.checkedFlag = false;
                    // }
                    let folderList = this.folderList;
                    let arr = folderList.filter(function (creent) {
                        if (creent.selectionFlag == true){
                            return creent;
                        }
                    });
                    //
                    if (arr.length > 0){
                        this.selectAll.showFlag = true;
                        this.selectAll.number = arr.length;
                        this.selectAll.checkedFlag = true;
                        // if(arr.length == folderList.length){
                        //     this.selectAll.checkedFlag = true;
                        // }else {
                        //     this.selectAll.checkedFlag = false;
                        // }
                    } else {
                        this.selectAll.showFlag = false;
                    }
                }
            },
            //资源详情移动、复制操作
            CurrentCallbackFun(event, status){
                this.copyOrmoveFunction(event, status, this.creentDetail);
            },
            //移动、复制操作
            copyOrmoveFunction(event, status, item){
                event.stopPropagation();
                //选中的需要复制和移动的数据
                let folderList = this.folderList;
                if (item){
                    //单文件复制移动操作
                    folderList.forEach(creent =>{
                        if (creent.id == item.id){
                            creent.selectionFlag = true;
                            item = creent;
                        } else {
                            creent.selectionFlag = false;
                        }
                    });
                    item.tooltipFlag = false;
                    this.cationData=[];
                    this.cationData.push(item);
                    this.countNumber();
                    // this.selectAll.showFlag = true;
                    // this.selectAll.number = this.cationData.length;
                } else {
                    //批量复制移动操作
                    let arr = folderList.filter(function (creent) {
                        if (creent.selectionFlag == true){
                            return creent;
                        }
                    });
                    this.cationData = [];
                    this.cationData = arr;
                }

                //获取文件夹目录
                this.copyOrmoveStatus = status;
                this.getfolderCatalog(null, {id: 0}, 0);
                this.copyOrmoveCatalogRoute={
                    creentRouter: [{routerName: i18n.t('workbench.work_resourceManagement'), id: 0}],
                    CatalogChild: []
                };
                // status : 0 移动 1 复制
                let str = status ? i18n.t('lang.lang_copy'):i18n.t('lang.lang_move');
                this.copyOrmove = {
                    flag: true,
                    title: str,
                    button: str+i18n.t('resources.res_comeHere'),
                    type: status
                };
            },
            //新建文件夹操作
            newfolder(){
                let folder = {
                    id: null,
                    name: i18n.t('resources.res_newFolder'),
                    type: 'folder',
                    editFlag: true,
                    selectionFlag: false,     //选中开关
                    tooltipFlag: false,
                    child_project: 0,
                    project: 0,
                    tag: 0
                };
                this.folderList.unshift(folder);
                this.$nextTick(function () {
                    this.$refs.inputVal[0].focus();
                });
            },
            //保存文件名操作
            saveName(event, item, index){
                item.editFlag = false;
                let oldName = item.name;
                String.prototype.trim=function(){return this.replace(/(^\s*)|(\s*$)/g, "");};
                let changeName = event.target.value.toString().trim();
                //let changeName = event.target.value.trim();
                let _this = this;
                let renameStatua = null;
                if (changeName){
                    let folderList = this.folderList.filter(function (creent) {
                        return creent.type == 'folder';
                    });
                    let folderListLenth = folderList.length;

                    for (let i=0;i<folderListLenth;i++){
                        if (folderList[i].name && folderList[i].name.trim() == changeName){
                            if (i != index){
                                renameStatua = 0;
                                _this.$Message.error(i18n.t('resources.res_folderRenaming'));
                                _this.newNameFlag = true;
                                item.editFlag = true;
                                _this.$refs.inputVal[0].focus();
                                break;
                            } else {
                                _this.newNameFlag = false;
                                if (item.id != null){
                                    renameStatua = 1;
                                    break;
                                } else {
                                    renameStatua = 2;
                                }
                            }
                        } else {
                            renameStatua = 2;
                            _this.newNameFlag = false;
                        }
                    }
                    // console.log(renameStatua)
                    if (renameStatua == 2){
                        item.name = changeName;
                        if (item.id != null){
                            //重命名
                            this.renameFolder(item);
                        } else {
                            //新建文件夹
                            this.newNameFlag = true;
                            this.newFolder(item);
                        }
                    }
                } else {
                    item.editFlag = true;
                    _this.$refs.inputVal[0].focus();
                    this.$Message.error(i18n.t('resources.res_folderNotNull'));
                }
            },
            //重命名操作
            editerName(item){
                this.folderList.forEach(function (creent) {
                    creent.editFlag = false;
                });
                item.editFlag = true;
                item.tooltipFlag = false;
                this.$nextTick(function () {
                    this.$refs.inputVal[0].focus();
                });
            },
            //显示操作栏
            showToolTip(event, item){
                event.stopPropagation();
                if (this.newNameFlag){
                    return false;
                }
                this.folderList.forEach((creent) => {
                    creent.tooltipFlag = false;
                });
                item.tooltipFlag = true;
            },
            //时间戳转时间
            coverTime(data){
                let time = new Date(data * 1000);
                let year = time.getFullYear();
                let month = (time.getMonth()+1) > 10 ? (time.getMonth()+1) : '0'+(time.getMonth()+1);
                let day = time.getDate() > 10 ? time.getDate() : '0'+time.getDate();
                let hours = time.getHours() > 10 ? time.getHours() : '0'+time.getHours();
                let minutes = time.getMinutes() > 10 ? time.getMinutes() : '0'+time.getMinutes();
                let seconds = time.getSeconds() > 10 ? time.getSeconds() : '0'+time.getSeconds();
                // console.log(year+'年'+month+'月'+day+'日 '+hours+':'+minutes+':'+seconds)
                return year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
            },
            //统计选中数量
            countNumber(){
                let folderList = this.folderList;
                let arr = folderList.filter(function (creent) {
                    return creent.selectionFlag;
                });
                this.selectAll.showFlag = true;
                this.selectAll.number = arr.length;
            },
            //----------------------------------------------------------------数据操作Start------------------------------------------------------------------------

            //页面初始化接口
            async ksydriveInit(){
                const init = await ksydrive.ksydriveInit();
                if (init.data.err_code == 0){
                    // console.log(12,'=============',init.data.guide);
                    if (init.data.guide === 'resource'){
                        this.bubble();
                    }
                    this.acc_token = init.data.data.acc_token;
                    this.resourceList = init.data.data.type_list;
                    this.btnsFlag = init.data.data.actions;
                    this.getresourceList();
                } else if (res.data.err_code == 2){
                    this.$router.push({ path: "/403" });
                } else {
                    this.$Messages.error(init.data.err_message);
                }
            },
            //资源页面列表
            async getresourceList(type){
                // if (type=='search'){
                //     if (!this.fileterObj.key){
                //         this.$Message.error('搜索不能为空，请重新输入');
                //         return;
                //     }
                // }
                const res = await ksydrive.getresourceList(this.fileterObj);
                //文件格式匹配
                let fileType = ['jpg', 'gif', 'bmp', 'jpeg', 'png', 'wmf', 'avi', 'mpeg', 'mov', 'mp4', 'rmvb', 'rm', '3gp', 'wma', 'fbx', 'json', 'stl', 'obj', '3ds'];
                let tmp = [];
                fileType.forEach(item =>{
                    tmp[item] = 1;
                });

                if (res.data.err_code == 0){
                    this.loadingFlag = false;
                    let data = res.data.data;
                    data.forEach(function (item) {
                        item.tooltipFlag = false;
                        if (item.type === 'file'){
                            let toLower = item.extension.toLowerCase();
                            if (!item.name){
                                if (item.url){
                                    let url = item.url;
                                    let spilitUrlArr = url.split('/');
                                    item.name = url.split('/')[spilitUrlArr.length-1];
                                } else {
                                    item.name = '--';
                                }

                            }
                            if (!tmp[toLower]){
                                item.extension = 'Unknown';
                            }
                        }
                    });
                    this.fileterObj.page_total = res.data.page.total;
                    this.fileterObj.page = res.data.page.page;
                    //
                    if (type=='more'){
                        this.folderList = this.folderList.concat(data);
                    } else {
                        this.folderList = data;
                    }
                } else {
                    this.loadingFlag = false;
                    this.$Message.error(res.data.err_message);
                }
            },
            //移动复制数据请求
            async copyOrmoveDataFunction(){
                //循环发送请求
                let copyOrmoveCatalogID = this.copyOrmoveCatalogRoute.creentRouter[this.copyOrmoveCatalogRoute.creentRouter.length-1].id;
                let cationDataArr = this.cationData;
                let _this = this;
                for (let i=0;i<cationDataArr.length;i++){
                    let obj = {
                        type: cationDataArr[i].type === 'folder' ? 'dir' : 'file',    //文件类型
                        id: cationDataArr[i].id,         //文件ID
                        toid: copyOrmoveCatalogID        //目标目录ID
                    };
                    // type : 0 移动 1 复制
                    let res = _this.copyOrmove.type ? await ksydrive.copyfolderApi(obj) : await ksydrive.movefolderApi(obj);

                    if (res.data.err_code == 0){
                        //重新获取资源列表
                        if (i == (cationDataArr.length-1)){
                            _this.$Message.success(_this.copyOrmove.type ? i18n.t('resources.res_copySuccess') : i18n.t('resources.res_moveSuccess'));
                            _this.copyOrmove.button = _this.copyOrmove.type ? i18n.t('resources.res_copyComplete') : i18n.t('resources.res_moveComplete');
                            _this.copyOrmove.flag = false;
                            _this.selectAll.showFlag = false;
                            _this.selectAll.number = 0;
                            _this.cationData = [];
                            // _this.clearFilerAndLoadfileList();
                        } else {
                            _this.copyOrmove.button = _this.copyOrmove.type ? i18n.t('resources.res_copyIn') : i18n.t('resources.res_moveIn');
                        }
                    } else {
                        // _this.$Message.error(res.data.err_message);
                        _this.copyOrmove.button = _this.copyOrmove.type ? i18n.t('resources.res_copyFail') : i18n.t('resources.res_moveFail');
                        _this.copyOrmove.flag = false;
                        this.selectAll.showFlag = false;
                        this.selectAll.number = 0;
                        // _this.clearFilerAndLoadfileList();
                        break;
                    }
                    _this.copyOrmove.button = _this.copyOrmove.type ? i18n.t('resources.res_copyHere') : i18n.t('resources.res_moveHere');
                }
            },
            //进入文件夹操作
            async enterFolderFunction(type, item, index){
                if (this.newNameFlag){
                    return false;
                }
                //type 0 目录 1进入
                if (type){
                    this.CatalogRoute.push(
                        {name: item.name, id: item.id}
                    );
                } else {
                    this.CatalogRoute = this.CatalogRoute.slice(0, index+1);
                }
                this.creentCatalogID = parseInt(item.id);
                this.selectAll.showFlag = false;
                this.selectAll.number = 0;
                this.fileterObj={
                    page: 1,
                    page_total: 0,
                    page_size: 45,
                    attr: 'null',
                    key: null,
                    order: 'new',
                    fid: item.id
                };
                this.getresourceList();
            },
            //资源详情
            async lookdetails(creentItem){
                if (this.newNameFlag){
                    return false;
                }
                //文件格式匹配
                let fileType = ['jpg', 'gif', 'bmp', 'jpeg', 'png', 'wmf', 'avi', 'mpeg', 'mov', 'mp4', 'rmvb', 'rm', '3gp', 'wma', 'fbx', 'json', 'stl', 'obj', '3ds'];
                let creentType = creentItem.extension.toLowerCase();
                let sendFlag = fileType.filter(item =>{
                    if (item === creentType){
                        return true;
                    } else {
                        return false;
                    }
                });
                if (sendFlag.length > 0){
                    const res = await ksydrive.lookFileDetailApi({id: creentItem.id});
                    if (res.data.err_code == 0){
                        let data = res.data.data;
                        if (!data.Name){
                            if (data.url){
                                let name = data.url.split('/');
                                data.Name = name[name.length-1];
                            } else {
                                this.$Message.error(i18n.t('resources.res_folderAdrr'));
                                return false;
                            }
                        }
                        this.creentDetail={
                            fileName: data.Name,
                            producer: data.author,
                            headImg: this.GLOBAL.imgDomain+'/index.php?r=system/user/get-headimage&id='+data.uid,
                            updateDate: this.coverTime(data.update_time),
                            projectName: data.project||null,
                            fileUrl: data.url,
                            fileList: data.file_list||[],
                            id: data.Id,
                            accToken: this.acc_token,
                            isThumb: !!creentItem.thumb
                        };
                        this.lookFile = true;
                    } else {
                        // this.$Message.error(res.data.err_message);
                    }
                } else {
                    this.$Message.warning(i18n.t('resources.res_folderPreview'));
                }
            },
            //移动复制操作获取文件夹目录
            async getfolderCatalog(type, item, index){
                if (!type){
                    this.copyOrmoveCatalogRoute.creentRouter = this.copyOrmoveCatalogRoute.creentRouter.slice(0, (index+1));
                } else {
                    this.copyOrmoveCatalogRoute.creentRouter.push({
                        routerName: item.name,
                        id: item.id
                    }
                    );
                }
                let obj = {
                    page: 1,
                    page_size: 45,
                    attr: null,
                    key: null,
                    order: 'new',
                    fid: item.id
                };
                //选中的需要复制和移动的数据
                let copyOrMoveData = this.cationData;
                // console.log(copyOrMoveData)
                const res = await ksydrive.getresourceList(obj);
                if (res.data.err_code == 0){
                    let resDataArr = res.data.data;
                    // copyOrmoveStatus : 0 移动 1 复制

                    if (!this.copyOrmoveStatus){
                        //本文件夹不能移动到本文件夹 所以过滤掉本文件夹  //对文件夹的过滤
                        let tmp = [];
                        copyOrMoveData.forEach(item =>{
                            if (item.type === 'folder'){
                                tmp[item.id] = 1;
                            }
                        });
                        let moveArr = resDataArr.filter(item =>{
                            if (item.type == 'folder' && !tmp[item.id]){
                                return item;
                            }
                        });
                        //如果文件ID和路径ID相同则表示不能移动到相同目录   //对文件的过滤
                        if (parseInt(copyOrMoveData[0].fid) == item.id){
                            this.moveBtnFlag = true;
                        } else {
                            this.moveBtnFlag = false;
                        }
                        this.copyOrmoveCatalogRoute.CatalogChild = moveArr;
                    } else {
                        this.moveBtnFlag = false;
                        //复制文件夹目录
                        this.copyOrmoveCatalogRoute.CatalogChild = resDataArr;
                    }
                } else {
                    // this.$Message.error(res.data.err_message);
                }
            },
            //下载资源
            async downloadFile(type, item){
                this.showDownloadPage = true;
                let folderList = this.folderList;
                if (type){
                    //单个下载
                    item.tooltipFlag = false;
                    folderList.forEach(function (creent) {
                        creent.selectionFlag = false;
                    });
                    item.selectionFlag = true;
                    this.countNumber();

                    let obj = {
                        type: item.type === 'folder' ? 'dir' : 'file',
                        id: item.id
                    };
                    const res = await ksydrive.resourceDownLoadApi(obj);
                    if (res.data.err_code == 0){

                    } else {
                        // this.$Message.error(res.data.err_message);
                    }
                } else {
                    //批量下载
                    let arr = folderList.filter(function (creent) {
                        return creent.selectionFlag;
                    });
                    let _this = this;
                    let length = arr.length;
                    for (let i=0;i<length;i++){
                        let obj = {
                            type: arr[i].type === 'folder' ? 'dir' : 'file',
                            id: arr[i].id
                        };
                        const res = await ksydrive.resourceDownLoadApi(obj);
                        if (res.data.err_code == 0){

                        } else {
                            // _this.$Message.error(res.data.err_message);
                        }
                    }
                }
            },
            //新建文件夹
            async newFolder(item){
                let obj = {
                    name: item.name,
                    fdir: this.creentCatalogID
                };
                let _this = this;
                const res = await ksydrive.newFolderApi(obj);
                if (res.data.err_code == 0){
                    this.$Message.success(i18n.t('resources.res_createSucess'));
                    //刷新当前目录
                    this.clearFilerAndLoadfileList();
                    setTimeout(function () {
                        _this.newNameFlag = false;
                    }, 1000);
                } else {
                    _this.newNameFlag = false;
                    // this.$Message.error(res.data.err_message);
                    this.folderList.shift();
                }
            },
            //恢复列表
            async recoveryListFun(){
                this.recoveryModel = true;
                const res = await ksydrive.getrecoveryListApi();
                if (res.data.err_code == 0){
                    this.recoveryList = res.data.data;
                } else {
                    // this.$Message.error(res.data.err_message);
                }
            },
            //恢复文件夹
            async recoveryFolder(item){
                let obj = {
                    fdir: item.id
                };
                let _this = this;
                item.is_delete = 0;
                const res = await ksydrive.recoveryFolderApi(obj);
                if (res.data.err_code == 0){
                    setTimeout(function () {
                        item.is_delete = 2;
                        //刷新当前目录
                        _this.getresourceList();
                    }, 2000);

                } else {
                    item.is_delete = 3;
                    // this.$Message.error(res.data.err_message);
                }
            },
            //删除资源
            async confirmDel(){
                const msg = this.$Message.loading({content: i18n.t('resources.res_deleIn'), duration: 0});
                let cationDataArr = this.cationData;
                for (let i=0;i<cationDataArr.length;i++){
                    let obj = {
                        type: cationDataArr[i].type === 'folder' ? 'dir' : 'file',    //文件类型
                        id: cationDataArr[i].id,         //文件ID
                    };
                    const res = await ksydrive.deleteResourceApi(obj);
                    if (res.data.err_code == 0){
                        this.lookFile = false;
                        if (i == (cationDataArr.length-1)){
                            setTimeout(msg, 1);
                            this.$Message.success(i18n.t('resources.res_deleSucess'));
                            this.selectAll.showFlag = false;
                            this.selectAll.number = 0;
                            this.cationData = [];
                            //刷新当前列表
                            this.fileterObj.page = 1;
                            this.getresourceList();
                        }
                    } else {
                        setTimeout(msg, 1);
                        // this.$Message.error(res.data.err_message);
                        break;
                    }
                }
            },
            //重命名
            async renameFolder(item){
                let obj = {
                    name: item.name,
                    id: item.id
                };
                const res = await ksydrive.renameApi(obj);
                if (res.data.err_code == 0){
                    //刷新当前目录
                    this.getresourceList();
                    this.$Message.success(i18n.t('resources.res_renameSucess'));
                } else {
                    // this.$Message.error(res.data.err_message);
                }
            },
            //加载更多
            async loadMore(){
                let scrollTop = parseInt($('.skyDriveList')[0].scrollTop);
                let height = parseInt($(".skyDriveList").height());
                let htmlHeight = parseInt($(".skyDriveUl").height());
                if (scrollTop + height >= htmlHeight){

                    if (this.fileterObj.page > this.fileterObj.page_total){
                        this.fileterObj.page = this.fileterObj.page_total;
                        this.$Message.info(i18n.t('resources.res_notData'));
                    } else {
                        this.fileterObj.page ++;
                        this.getresourceList('more');
                    }
                }
            },
            //3D文件截图
            async Skyscreenshot(data){
                let obj = {
                    id: data.fileID,
                    thumb: data.url
                };
                const res = await ksydrive.saveThumb(obj);
                if (res.data.err_code == 0){
                    this.$Message.success(i18n.t('resources.res_3DImg'));
                    this.clearFilerAndLoadfileList();
                } else {
                    // this.$Message.error('3D缩略图保存失败！');
                }
            },
            //清空过滤条件并初始化文件列表
            clearFilerAndLoadfileList(){
                this.fileterObj={
                    page: 1,
                    page_total: 0,
                    page_size: 45,
                    attr: 'null',
                    key: null,
                    order: 'new'
                };
                this.getresourceList();
            },
            //资源选择
            changeList(){
                this.fileterObj.page = 1;
                this.getresourceList();
            }
        },
        mounted(){
            let _this = this;
            $('#skyDriveContent').click(function () {
                _this.folderList.forEach(function (creent) {
                    creent.tooltipFlag = false;
                });
            });
            this.ksydriveInit();
            // 注册scroll事件并监听
            $(".skyDriveList").scroll(function(){
                _this.loadMore();
            });

        },
        watch: {
            folderList: function(){
                let height = $(".skyDriveList").scrollTop();
                this.$nextTick(() => {
                    var div = document.getElementsByClassName('skyDriveList')[0];
                    div.scrollTop = height;
                });
            }
        },
        filters: {
            coverTime(date){
                if (date){
                    let time = new Date(date * 1000);
                    let year = time.getFullYear();
                    let month = (time.getMonth()+1) > 10 ? (time.getMonth()+1) : '0'+(time.getMonth()+1);
                    let day = time.getDay() > 10 ? time.getDay() : '0'+time.getDay();
                    let hours = time.getHours() > 10 ? time.getHours() : '0'+time.getHours();
                    let minutes = time.getMinutes() > 10 ? time.getMinutes() : '0'+time.getMinutes();
                    let seconds = time.getSeconds() > 10 ? time.getSeconds() : '0'+time.getSeconds();
                    // console.log(year+'年'+month+'月'+day+'日 '+hours+':'+minutes+':'+seconds)
                    return year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
                } else {
                    return '00-00-00 00:00:00';
                }
            }
        }
    };
</script>
<style lang="less">
    .copyOrmoveModal{
        .ivu-modal-body{
            padding: 20px 0;
        }
    }
    .recoveryModal{
        .ivu-modal-body{
            position: relative!important;
        }
    }

    .DriveRow1{
        .right{
            .ivu-input-wrapper{
                margin-right: 20px;
                .ivu-input-icon{line-height: 32px!important;}
                input[class='ivu-input']{height: 32px !important;}
            }
        }
    }
    .DriveRow2{
        .right{
            .ivu-select-selection{
                height: 32px !important;
                .ivu-select-selected-value{
                    height: 32px !important;
                    line-height: 32px!important;
                }
            }
        }
    }
</style>
<style lang="less" scoped>
    .skyDriveContent{
        .base-card;
        margin-bottom:30px;
        padding: 0px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        .skyDriveTop{
            padding: 20px 20px 10px 20px;
            border-radius: 3px;
            border-bottom: 1px solid @black_4;
            .DriveRow1{
                display: flex;
                justify-content: space-between;
                align-items: center;
                .left{
                    display: flex;
                    align-items: center;
                    span{
                        font-size: 13px;
                        &:before{
                            transform: rotate(90deg);
                            display: inline-block;
                            padding: 0 5px;
                        }
                        &:first-child{
                            &:before{
                                display: none;
                            }
                        }
                        &:last-child{
                            color: #b9b9b9;
                        }
                        &:hover{
                            text-decoration: underline;
                            cursor: pointer;
                            color: @base;
                        }
                    }
                }
                .right{
                    display: flex;
                    button{
                        border: 1px solid #ececec;
                        border-radius: 3px;
                        height: 32px;
                        /*line-height: 32px;*/
                        width: 80px;
                        /*padding: 5px 15px;*/
                        background: #fff;
                        color: @base;
                        margin-right: 5px;
                        outline: none;
                        &:nth-child(4),&:nth-child(5){
                            background: @base!important;
                            color: @white;
                            border-color: @base !important;
                            &:hover{
                                background: @base_active !important;
                            }
                        }
                        &:hover{
                            cursor: pointer;
                            background: @base;
                            color: #fff;
                            border-color: @base!important;
                        }
                    }
                    .upload-operate{float: right}
                }
            }
            .DriveRow2{
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
                .left{
                    display: flex;
                    align-items: center;
                    .actionItem{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-right: 20px;
                        span{
                            font-size: 13px;
                            font-weight: lighter;
                            padding: 0 10px;
                            &:hover{
                                cursor: pointer;
                                color: @base;
                                &:before{
                                    color: @base;
                                }
                            }
                            &:before{
                                /*font-weight: bold!important;*/
                                color: #a2a2a2;
                                display: inline-block;
                                padding-right: 3px;
                            }
                            &.icon-source-move{
                                &:before{
                                    padding-right: 0;
                                    padding-top: 3px;
                                    transform: rotate(90deg);
                                }
                            }
                            &.icon-sourceDel:hover{
                                &:before{color: @red}
                                color: @red;
                            }

                        }
                    }
                }
                .right{
                    /*display: flex;*/
                    /*align-items: center;*/
                    .selectP{
                        display: flex;
                        align-items: center;
                        .ivu-select{
                            width:120px;
                            .ivu-select-selection {
                                .ivu-select-selected-value{
                                    color: @base!important;
                                }
                                .ivu-select-placeholder{
                                    display: block !important;
                                    color:@black_3;
                                }
                            }
                        }
                    }
                }
            }
        }
        .skyDriveList{
            padding: 0 20px;
            height: 700px;
            margin-top: 2px;
            margin-bottom: 2px;
            border-radius: 3px;
            overflow: auto;
            &::-webkit-scrollbar { /*滚动条整体样式*/width: 5px; /*高宽分别对应横竖滚动条的尺寸*/height: 10px;}
            &::-webkit-scrollbar-thumb { /*滚动条里面小方块*/border-radius: 3px;-webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);background: rgba(0, 0, 0, 0.2);}
            &::-webkit-scrollbar-track { /*滚动条里面轨道*/-webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);border-radius: 0;background: rgba(0, 0, 0, 0.1);}
            .skyDriveUl{
                overflow: hidden;
                display: flex;
                flex-wrap: wrap;
                .skyDriveLi{
                    position: relative;
                    width: 11.1111%;
                    min-width: 160px;
                    border-radius: 3px;
                    padding: 16px 3px;
                    cursor: pointer;
                    text-align: center;
                    .tag{
                        position: absolute;
                        top: 3px;
                        right: 18px;
                        border: 1px solid @base;
                        border-radius: 3px;
                        color: @base;
                        -webkit-text-size-adjust:none;
                        font-size: 12px;
                        display: none;
                        padding: 0 10px;
                    }
                    .icon-shenglve-{
                        font-size: 16px;
                        font-weight: bold;
                        position: absolute;
                        top: 3px;
                        right: 5px;
                        transform: rotate(90deg);
                        color: #bdbdbd;
                        display: none;
                        &:hover{
                            color: @base;
                        }
                    }
                    .tooltip{
                        position: absolute;
                        right: -77px;
                        top: 20px;
                        width: 90px;
                        border: 1px solid #ccc;
                        border-radius: 3px;
                        background: #fff;
                        z-index: 1;
                        ul {
                            li{
                                padding: 5px 5px;
                                text-align: left;
                                .iconfonts{
                                    font-size: 12px;
                                    color: #b7b6b6;
                                    &:before{
                                        padding: 0 5px;
                                    }
                                }

                                &:hover{
                                    background: #e0fffa;
                                }
                            }
                        }
                    }
                    .moveAndCopy{
                        position: absolute;
                        right: -140px;
                        top: 20px;
                        width: 200px;
                        border: 1px solid #ccc;
                        border-radius: 3px;
                        background: #fff;
                        z-index: 1;
                        text-align: left;
                        .head{
                            padding: 3px 5px;
                            border-bottom: 1px solid #ccc;
                        }
                        .copyOrmoveRouter{
                            text-align: left;
                            padding: 2px 5px;
                            /*padding: 0 30px;*/
                            span{
                                color: #ccc;
                                font-size: 12px;
                                &:before{
                                    transform: rotate(90deg);
                                    display: inline-block;
                                }
                                &:first-child{
                                    &:before{
                                        display: none;
                                    }
                                }
                                &:hover{
                                    text-decoration: underline;
                                    cursor: pointer;
                                    color: @base;
                                }
                            }
                        }
                        .copyOrmoveUl{
                            height: 150px;
                            overflow: auto;
                            li{
                                padding: 5px;
                            }
                        }
                    }
                    &.folder{
                        .folderIcon{
                            height: 100px;
                        }
                    }
                    &.file{
                        .filePic{
                            display: flex;
                            align-items: center;
                            height: 100%;
                            margin-top: 10px;
                            img{
                                max-width: 100%;
                                /*max-width: 180px;*/
                                max-height: 100px;
                                /*height: 105px;*/
                                border-radius: 3px;
                                display: inline-block;
                            }
                        }
                    }
                    .boxSty{
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        align-items: center;
                        height: 100%;
                        overflow: hidden;
                    }
                    .folderName{
                        width: 100%;
                        text-align: center;
                        margin-top: 10px;
                        span{
                            width: 100%;
                            display: block;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        input{
                            border: 1px solid #bdbdbd;
                            border-radius: 3px;
                            padding: 2px;
                        }
                    }
                    .checkbox{
                        position: absolute;
                        top: 3px;
                        left: 5px;
                        display: none;
                    }
                    &:nth-child(9n){
                        /*margin-right: 0;*/
                        .tooltip{
                            left: 90px!important;
                        }
                    }
                    &.checkedSty{
                        background: rgba(224,255,250,1);
                        border: 1px solid @base;
                    }
                    &:hover .function ,
                    &:hover .fileFunction ,
                    &:hover .checkbox ,
                    &:hover .icon-shenglve- ,
                    &:hover .tag{
                        display: block;
                    }

                }
            }
        }
    }
    .copyOrmoveModal{
        .copyOrmoveRouter{
            padding: 0 30px;
            span{
                color: #ccc;
                font-size: 13px;
                &:before{
                    transform: rotate(90deg);
                    display: inline-block;
                    padding: 0 5px;
                }
                &:first-child{
                    &:before{
                        display: none;
                    }
                }
                &:hover{
                    text-decoration: underline;
                    cursor: pointer;
                    color: @base;
                }
            }
        }
        .copyOrmoveUl{
            margin-top: 20px;
            height: 400px;
            overflow: auto;
            &::-webkit-scrollbar { /*滚动条整体样式*/width: 5px; /*高宽分别对应横竖滚动条的尺寸*/height: 10px;}
            &::-webkit-scrollbar-thumb { /*滚动条里面小方块*/border-radius: 3px;-webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);background: rgba(0, 0, 0, 0.2);}
            &::-webkit-scrollbar-track { /*滚动条里面轨道*/-webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);border-radius: 0;background: rgba(0, 0, 0, 0.1);}
            /*&.ivu-menu {overflow-y: auto !important;}*/
            /*&::-webkit-scrollbar{*/
                /*width: 3px!important;*/
            /*}*/
            li{
                color: #868686;
                padding: 10px 30px;
                border-radius: 3px;
                i{font-size: 20px}
                &:hover{
                    cursor: pointer;
                    background: #b0efe2;
                }
                &.copyOrmoveCheckSty{
                    background: #ececec!important;
                }
            }
        }
        .copyOrMoveSty{
            button{
                background: #fff;
                border: 1px solid #f1f1f1;
                width: 100px;
                text-align: center;
                padding: 8px 0;
                border-radius: 3px;
                outline: none;
                cursor: pointer;
                &:last-child{
                    background: @base;
                    color: #fff;
                }
                &.disabledSty{
                    background: #ccc;
                    cursor: no-drop;
                }
            }
        }
    }
    .recoveryModal{
        .tips{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 40px;
            line-height: 40px;
            padding-left: 30px;
            background: #fef3de;
            color: #f6bb4d;
            i{
                font-style: normal;
                display: inline-block;
                width: 14px;
                height: 14px;
                line-height: 14px;
                border: 1px solid #efbe58;
                border-radius: 100%;
                text-align: center;
            }
        }
        .thead{
            position: absolute;
            top: 40px;
            left: 0;
            right: 0;
            height: 40px;
            line-height: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #bdbdbd;
            border-bottom: 1px solid #eaeaea;
            padding: 10px 30px;
            span{
                width: 33.33333%;
                text-align: center;
                &:first-child{
                    text-align: left;
                }
                &:last-child{
                    text-align: right;
                }
            }
        }
        .recoveryList{
            margin-top: 70px;
            ul{
                min-height: 300px;
                max-height: 500px;
                overflow: auto;
                li{
                    display: flex;
                    justify-content: space-between;
                    height: 50px;
                    line-height: 50px;
                }
                span{
                    font-size: 13px;
                    color: #929191;
                    text-align: center;
                    white-space: nowrap;
                    width: 33.3333%;
                    &:first-child{text-align: left;}
                    &:last-child{
                        text-align: right;
                        color: @base;
                        i{
                            font-style: normal;
                            border-radius: 3px;
                            border: 1px solid @base;
                            padding: 2px 8px;
                            &:hover{
                                cursor: pointer;
                                background: @base;
                                color: #fff;
                            }
                        }
                    }
                }
            }
        }
    }
    .deleteModel{
        .deleteContent{
            p{
                &:first-child{
                    i{
                        font-style: normal;
                        display: inline-block;
                        font-size: 15px;
                        font-weight: bold;
                        color: @red;
                        padding: 0 10px;
                    }
                }
                &:last-child{
                    margin-top: 20px;
                    color: #bdbdbd;
                }
            }
        }
    }
    .checkSty{
        color: @base;
    }
</style>
