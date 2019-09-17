<template>
    <!-- 模型插槽 -->
    <div id='base3D'>
        <div id="mainId">
            <h1 class="error-extension" v-if="tdExtError">{{$t('project.pro_notSupportedFormatFile')}}</h1>
            <resource-loading v-if="resourceCompleteLoading" :loadedParams="loadedParams"></resource-loading>
            <div class="td-main-container" v-show="showTdContainer">
                <div class="left-menu-bar">
                    <p class="toggle-menu">
                        <i class="toggle-icon" :title="$t('project.pro_showActionBar')"></i>
                    </p>
                    <div id="menuBar"></div>
                </div>
                <div id="info">
                    <p class="toggle-menu">
                        <i class="toggle-icon" :title="$t('project.pro_showActionBar')"></i>
                    </p>
                </div>
                <div id="menu_progress">
                    <div class="screen-operate">
                        <a class="full-screen" :title="$t('project.pro_fullScreen')">
                            <i class="iconfonts icon-full_screen"></i>
                            <!--<Icon type="arrow-expand"></Icon>-->
                        </a>
                        <a class="default-full-screen" :title="$t('project.pro_fullScreen')">
                            <i class="iconfonts icon-full_screen"></i>
                            <!--<Icon type="arrow-expand"></Icon>-->
                        </a>
                        <!--<a class="exit-full-screen" title="退出全屏"><Icon type="arrow-shrink"></Icon></a>-->
                        <a class="default-screen" :title="$t('workbench.work_reduction')">
                            <Icon type="ios-browsers-outline"></Icon>
                        </a>
                        <a class="max-screen" :title="$t('project.pro_maximization')">
                            <i class="iconfonts icon-fullscreen1"></i>
                        </a>
                        <a class="full-max-screen" :title="$t('project.pro_maximization')">
                            <i class="iconfonts icon-fullscreen1"></i>
                        </a>
                    </div>

                    <div class="ctrl-speed" v-if="showSpeedActive">
                        <dl>
                            <!--<dt>x<span class="play-speed">1</span>倍速</dt>-->
                            <dt>
                                <i class="iconfonts icon-fast" :title="$t('project.pro_playTimesSpeed')"></i>
                            </dt>
                            <dd>
                                <i class="triangle-down-icon"></i>
                                <ul>
                                    <li><span>0.1</span>{{$t('project.pro_DoubleSpeed')}}</li>
                                    <li><span>0.5</span>{{$t('project.pro_DoubleSpeed')}}</li>
                                    <li class="selected-speed"><span>1</span>{{$t('project.pro_DoubleSpeed')}}</li>
                                    <li><span>2</span>{{$t('project.pro_DoubleSpeed')}}</li>
                                </ul>
                            </dd>
                        </dl>
                        <!--<i class="triangle-icon"></i>-->
                    </div>

                    <div class="play-area" v-if="showSpeedActive">
                        <a :title="$t('project.pro_selectPlayInterval')" class="pick-play-area">
                            <i class="iconfonts icon-areacycle"></i>
                        </a>
                        <a :title="$t('project.pro_singlePlay')" class="play-once">
                            <i class="iconfonts"
                               :class="{'icon-onecycle': !isCirclePlay, 'icon-inside-cycle': isCirclePlay}"></i>
                        </a>
                    </div>
                    <div class="show-attributes">
                        <a :title="bonesTitle" class="show-hide-bones" v-if="showSkeletonCtrl">
                            <i class="iconfonts icon-showperson"></i>
                        </a>
                        <a :title="autoRotateTitle" class="open-close-auto-rotate">
                            <i class="iconfonts icon-rota"></i>
                        </a>
                        <a :title="xyzAxisTitle" class="show-hide-axis">
                            <i class="iconfonts icon-xyz-asix"></i>
                        </a>
                        <div :title="$t('project.pro_textureContrast')" class="show-hide-map">
                            <dl>
                                <dt><i class="iconfonts icon-921caidan_hezi"></i></dt>
                                <dd class="render-option">
                                    <i class="triangle-down-icon"></i>
                                    <ul>
                                        <li v-if="materialLibraries.hasNormalMap" class="normal-map" default-name="normal-map">{{$t('project.pro_normal')}}</li>
                                        <li v-if="materialLibraries.hasBumpMap" class="bump-map" default-name="bump-map">{{$t('project.pro_concaveConvex')}}</li>
                                        <li v-if="materialLibraries.hasSpecularMap" class="specular-light" default-name="specular-light">{{$t('project.pro_highlight')}}</li>
                                        <li v-if="materialLibraries.hasAoMap" class="ao-map" default-name="ao-map">AO</li>
                                        <li v-if="materialLibraries.hasEmissiveMap" class="emissive-map" default-name="emissive-map">{{$t('project.pro_selfLuminous')}}</li>
                                        <li v-if="materialLibraries.hasLightMap" class="light-map" default-name="light-map">{{$t('project.pro_illumination')}}</li>
                                        <li v-if="materialLibraries.hasDisplacementMap" class="displacement-map" default-name="displacement-map">{{$t('project.pro_permute')}}</li>
                                        <li v-if="materialLibraries.hasEnvMap" class="env-map" default-name="env-map">{{$t('project.pro_environment')}}</li>
                                        <li v-if="materialLibraries.hasRoughMap" class="rough-map" default-name="rough-map">{{$t('project.pro_rough')}}</li>
                                        <li v-if="materialLibraries.hasGradienMap" class="gradien-map" default-name="gradien-map">{{$t('project.pro_shade')}}</li>
                                        <li v-if="materialLibraries.hasAlphaMap" class="alpha-map" default-name="alpha-map">{{$t('project.pro_lucency')}}</li>
                                        <li class="wire-frame" default-name="wire-frame">{{$t('project.pro_wireframe')}}</li>
                                        <li class="all-models show-current-render" default-name="all-models">{{$t('lang.lang_all')}}</li>
                                    </ul>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="sign-content-box">
            <textarea class="edit-sign-content" v-show="canEditSignContent" :placeholder="$t('project.pro_enterSignContent')"></textarea>
            <p class="show-sign-content" v-show="!canEditSignContent"></p>
            <div class="btn-group" v-show="canEditSignContent">
                <a class="cancel-sign-btn">{{$t('lang.lang_cancel')}}</a>
                <a class="confirm-sign-btn">{{$t('project.pro_sign')}}</a>
            </div>
        </div>
        <!-- <div class="editTool" v-if="(userPost.postId != '3' && signData.status == 1) ||
                                    ((userPost.postId != '3' && testData.is_test) && testData.upload.status == 1)">
            <i class="project_instrument tagimage"></i>
            <p class="canvasEditText">审核工具</p>
            <Icon type="paintbrush"
                  class="icon" title="修改标记"></Icon>
            <Icon type="paintbucket" class="icon"
                  title="修改颜色"></Icon>
        </div> -->
    </div>
</template>
<script>
    import feedbackInfo from './feedbackInfo.vue';
    import commonLoading from './common_loading.vue';
    import resourceLoading from './td_resource_loading.vue';
    import {mapState, mapMutations} from 'vuex';
    import api from 'api';
    import global from '../../../global/Global';
    import Cookies from 'js-cookie';

    export default {
        name: 'three-model',
        props: {
            is_collaboration: {
                type: Number
            },
            taskInfos: {
                type: Object,
                default: function () {
                    return {};
                }
            },
            memberUpload: {
                type: String,
                default: ''
            },
            height: {
                type: Number,
                default: 0
            },
            isPreview: Boolean
        },
        watch: {

            /*重构开始*/
            taskInfos (val) {
                this.taskInfos = val;
                this.init();
            },

            /*重构结束*/
            storeSignSum (newVal) {
                this.sumSign = newVal;
                this.$emit('signSumNumber', newVal);
            },
        },
        data () {
            return {
                uniqueness: null,
                fileId: null,
                isAnimationShow: false,
                animationProgressData: {
                    value: 0, //进度值
                    min: 0, //最大值
                    max: 100, //最小值
                    pervalue: 0,
                    timeNow: 0,
                    button: {},
                },
                threeDControl: {},
                PermissionLevel: {
                    MANAJER: 1,
                    LEADER: 2,
                    MENBER: 3,
                    COMMERCIAL: 4,
                },
                signData: {},
                userPost: {
                    type: null,
                    postName: '',
                    postId: null
                },
                sumSign: 0,
                screenWH: [],
                isFull: false,
                isFullScreen: false,
                currentLoading: true,
                resourceCompleteLoading: false,
                showSpeedActive: false,
                isAnimate: false, //是否是动作文件
                showSkeletonCtrl: false,
                stageFeedbackStatus: null,
                isCirclePlay: false,
                bonesTitle: i18n.t('project.pro_hideTheSkeleton'),
                autoRotateTitle: i18n.t('project.pro_autorotation'),
                xyzAxisTitle: i18n.t('project.pro_hiddenAxis'),
                showTdContainer: false,
                tdExtError: false,
                loadedParams: {
                    loadedPercent: 5
                },
                secretUrl: null,
                path: '',
                isSignPermission: true,
                windowResize: null,
                renderer: null,
                obj: null,
                stopAnimate: null,
                signedDataList: [],
                materialLibraries: {
                    hasAlphaMap: false,
                    hasAoMap: false,
                    hasBumpMap: false,
                    hasNormalMap: false,
                    hasSpecularMap: false,
                    hasEmissiveMap: false,
                    hasLightMap: false,
                    hasDisplacementMap: false,
                    hasEnvMap: false,
                    hasRoughMap: false,
                    hasGradienMap: false
                },
                canEditSignContent: true
            };
        },
        filters: {
            filtStat (val) {
                if (val == 1) {
                    return i18n.t('project.pro_internalPending');
                } else if (val == 2) {
                    return i18n.t('project.pro_customerPending');
                } else if (val == 3) {
                    return i18n.t('project.pro_internalFeedback');
                } else if (val == 4) {
                    return i18n.t('project.pro_customerFeedback');
                } else if (val == 5) {
                    return i18n.t('project.pro_passAudit');
                } else {
                    return '--';
                }
            }
        },

        computed: {
            storeSignSum () {
                return this.$store.state.ImgVedioStatus.sumSign;
            }
        },
        mounted () {
            document.querySelector('#mainId').style.height = '680px';
            this.calculatePermission();
            this.init();
        },
        methods: {
            ...mapMutations([ 'calculateSignSum', 'setCurrentStageId' ]),
            calculatePermission () {
                let companyData = JSON.parse(Cookies.get('company'));
                this.userPost.postId = companyData.post_id;
                this.userPost.type = companyData.type;
                if (this.taskInfos.isTestTask) {
                    if (this.userPost.postId === '3') {
                        this.isSignPermission = false;
                    } else {
                        this.isSignPermission = this.taskInfos.status === '1';
                    }
                } else {
                    if (this.taskInfos.status === '1') {
                        this.isSignPermission = !(this.userPost.postId === '3' || (this.userPost.type && this.is_collaboration));
                    }
                    if (this.taskInfos.status === '2') {
                        if (this.is_collaboration && !this.userPost.type) {
                            this.isSignPermission = false;
                        } else {
                            this.isSignPermission = !!(this.is_collaboration && this.userPost.type);
                        }
                    }
                    if (this.taskInfos.status === '3' || this.taskInfos.status === '4' || this.taskInfos.status === '5') {
                        this.isSignPermission = false;
                    }
                }
            },
            init () {
                this.getSecretUrl();
                this.getId();
                this.userInfos();
                this.$store.commit('calculateSignSum', 0);
            },
            getSecretUrl () {
                let fileList = this.taskInfos.file;
                let fileUrl = fileList.filter((creent) => creent.is_main === '1');
                let urlList = fileUrl[ 0 ].file;

                if (urlList.indexOf('/file-upload/') !== -1) {
                    let i = urlList.lastIndexOf('.');
                    let fileUrl = urlList.substring(0, i);
                    // 截取fbx贴图路径
                    let num = urlList.lastIndexOf('/');
                    this.path = urlList.substring(0, num + 1);
                    this.secretUrl = fileUrl;
                } else {
                    let index = urlList ? urlList.lastIndexOf('.') : null;
                    // 截取fbx贴图路径
                    let lastNum = urlList.lastIndexOf('/');
                    this.path = urlList.substring(0, lastNum + 1)
                        .replace('/file-out/', '/file-upload/');
                    if (index) {
                        let url = urlList.substring(0, index);
                        this.secretUrl = $.ajax({url: url, async: false}).responseText;
                    }
                }
            },
            async getId () {
                let _this = this;
                if (_this.isPreview) {
                    let fileListUrl = this.taskInfos.file;
                    if (fileListUrl && fileListUrl.length > 0) {
                        for (let i = 0; i < fileListUrl.length; i++) {
                            let fileUrl = fileListUrl[ i ].file;
                            let index = fileUrl.lastIndexOf('.');
                            let ext = fileUrl.substring(index)
                                .toLowerCase();
                            if (ext === '.3ds' || ext === '.fbx' || ext === '.obj' || ext === '.json' || ext === '.stl' || ext === '.mp4' || ext === '.rmvb' || ext === '.avi' || ext === '.max') {
                                fileListUrl.splice(i, 1);
                            }
                        }
                        _this.textureList = fileListUrl;
                    }
                    _this.getSign();
                } else {
                    let fileList = this.taskInfos.file;
                    let fileUrl = fileList.filter((creent) => creent.is_main === '1');
                    this.fileId = fileUrl[ 0 ].id;
                    this.getFileList();
                }
            },
            // 数组对象排序
            sortByKey (arr, field) {
                return arr.sort((a, b) => a[ field ] - b[ field ]);
            },

            // Get models file list
            getFileList () {
                let fileList = this.taskInfos.file;
                this.textureList = fileList.filter(item => item.is_main === '0');
                this.textureList = this.textureList.map(item => ({file: item.file}));
                this.getSign();
            },

            onload () {
                $LAB.setOptions({AlwaysPreserveOrder: true})
                    .script('/static/three/three.js')
                    .script('/static/three/inflate.min.js')
                    .script('/static/three/TGALoader.js')
                    .script('/static/three/FBXLoader.js')
                    .script('/static/three/STLLoader.js')
                    .script('/static/three/TDSLoader.js')
                    .script('/static/three/DDSLoader.js')
                    .script('/static/three/OBJLoader.js')
                    .script('/static/three/CSS3DRenderer.js')
                    .script('/static/three/OrbitControls.js')
                    .wait(() => {
                        this.newFBXMedel();
                    });
            },
            // initBaseUrl() {
            //     let _url = this.storeFileURl;
            //     let index = _url.lastIndexOf('/');
            //     this.file_BaseUrl = decodeURI(_url.substring(0, index));
            // },
            newFBXMedel () {
                clearInterval(this.stopAnimate);
                this.stopAnimate = null;
                let _this = this;
                let container = null, controls = null;//容器、状态、控制器
                let camera = null, scene = null, renderer = null, renderer2 = null;//相机、场景、渲染、灯光
                let clock = new THREE.Clock();//时钟
                clock.start();
                _this.clock = clock;
                let skeletonShow = null;//骨骼助手
                let mixers = [];
                let signedData = [];
                let signTexts = [], getSignTexts = [];
                let mouse = new THREE.Vector2();
                let urlObject = null;//加载的物体
                let urlAnimate = {};//加载的物体的动画
                let boxRange = {x: 1, y: 1, z: 1};
                let file_BaseUrl = this.path;
                let progress_drag_button_bool = false;
                let mainLeft = document.getElementById('mainId').getBoundingClientRect().left;
                let mainbouding = document.getElementById('mainId').getBoundingClientRect();
                let textMap = [];
                let screenWH = [];
                let speed = 1;
                let beginPervalue = 0;
                let totalTimes = 0;
                let loop = 'infinity';
                let screenMatrix = {};

                init(_this.secretUrl);//初始化
                animate();//动画

                //角色灯
                function creatLight () {
                    let light = new THREE.HemisphereLight(0xffffff, 0x444444);
                    light.position.set(0, 200, 0);
                    return light;
                }

                //场景灯
                function creatDirectionalLight () {
                    let light = new THREE.DirectionalLight(0xffffff);
                    light.position.set(0, 200, 100);
                    light.castShadow = true;
                    light.shadow.camera.top = 180;
                    light.shadow.camera.bottom = -100;
                    light.shadow.camera.left = -120;
                    light.shadow.camera.right = 120;
                    return light;
                }

                //地面
                function creatGround () {
                    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(8000, 8000), new THREE.MeshPhongMaterial({
                        color: 0x999999,
                        depthWrite: false
                    }));
                    mesh.rotation.x = -Math.PI / 2;
                    mesh.receiveShadow = true;
                    return mesh;
                }

                //地面助手
                function creatGridHelp () {
                    let grid = new THREE.GridHelper(8000, 20, 0x000000, 0x000000);
                    grid.material.opacity = 0.2;
                    grid.material.transparent = true;
                    return grid;
                }

                // 坐标轴
                function axisHelper () {
                    let axis = new THREE.AxesHelper(4000);
                    axis.axisName = 'animateAxis';
                    return axis;
                }

                //创建场景
                function creatScene () {
                    let cubeTextureLoader = new THREE.CubeTextureLoader();
                    cubeTextureLoader.setPath('/static/three/scene_bg/');
                    //六张图片分别是朝前的（posz）、朝后的（negz）、朝上的（posy）、朝下的（negy）、朝右的（posx）和朝左的（negx）。
                    let cubeTexture = cubeTextureLoader.load([
                        'px.png', 'nx.png',
                        'py.png', 'ny.png',
                        'pz.png', 'nz.png'
                    ]);

                    let scene = new THREE.Scene();
                    scene.background = cubeTexture;
                    // scene.fog = new THREE.Fog( 0xa0a0a0, 0, 200 );
                    scene.add(creatLight());
                    scene.add(creatDirectionalLight());
                    scene.add(creatGround());
                    scene.add(creatGridHelp());
                    scene.add(axisHelper());
                    return scene;
                }

                // camera & animate common fn
                function calculationCameraAndAnimate (obj) {
                    object_addAnimateControl(obj);//处理动画
                    object_fixCamera(obj);//镜头
                }

                // 读取资源进度条
                function readResourcePercent () {
                    let loadInterval = null;
                    if (_this.resourceCompleteLoading) {
                        loadInterval = setInterval(() => {
                            _this.loadedParams.loadedPercent += 5;
                            if (_this.loadedParams.loadedPercent >= 90) {
                                clearInterval(loadInterval);
                            }
                        }, 100);
                    } else {
                        clearInterval(loadInterval);
                    }
                }

                //读取模型
                function loadModel (url) {
                    // 这里的类型根据文件的类型使用不同的读取方式
                    // let type = _this.storeFileExt;
                    let fileList = _this.taskInfos.file;
                    let fileUrl = fileList.filter((creent) => creent.is_main === '1');
                    let urlList = fileUrl[ 0 ].file;
                    // let urlList = _this.storeFileURl;
                    let indexOf = urlList.lastIndexOf('.');
                    let type = urlList.substring(indexOf)
                        .toLowerCase();
                    _this.resourceCompleteLoading = true;

                    // debugger;
                    readResourcePercent();
                    switch (type) {
                        case '.fbx':
                            _this.showTdContainer = true;
                            loadFBXModel(url);
                            break;
                        case '.3ds':
                            _this.showTdContainer = true;
                            load3DSModel(url);
                            break;
                        case '.obj':
                            _this.showTdContainer = true;
                            loadObjMtlModel(url);
                            break;
                        case '.json':
                            _this.showTdContainer = true;
                            loadJsonModel(url);
                            break;
                        case '.js':
                            loadJsModel(url);
                            break;
                        case '.stl':
                            _this.showTdContainer = true;
                            loadStlModel(url);
                            break;
                        case '.max':
                        case '.dds':
                        case '.tga':
                            _this.tdExtError = true;
                            _this.showTdContainer = false;
                            _this.resourceCompleteLoading = false;
                            break;
                        default:
                            _this.tdExtError = true;
                            _this.showTdContainer = false;
                            _this.resourceCompleteLoading = false;
                            break;
                    }
                }

                // Model loader progress
                let onProgress = function (xhr) {
                    if (xhr.lengthComputable) {
                        let percentComplete = xhr.loaded / xhr.total * 100;
                        console.log('Loading model:' + Math.round(percentComplete, 2) + '% downloaded');
                    }
                };

                // Loader error callback
                let onError = function (xhr) {
                    console.warn('Loading error:', xhr);
                };

                /**
                 *  筛选贴图后缀名加载不同的模型格式 （obj, obj-mtl）
                 *  map —> Array
                 */
                function filterTextureExt (map) {
                    if (map && map.length > 0) {
                        let mtlMap = map.filter(item => item.file.lastIndexOf('.mtl') !== -1);
                        if (mtlMap && mtlMap.length > 0) {
                            return mtlMap;
                        } else {
                            let otherMap = map.filter(item => item.file.lastIndexOf('.mtl') === -1);
                            if (otherMap && otherMap.length > 0) {
                                return otherMap;
                            }
                        }
                    } else {
                        console.warn(i18n.t('project.pro_noTextureFormatAvailable'));
                        return [];
                    }
                }

                // 判断是否为2的幂
                function checkNum (num) {
                    num = num.toString(2);
                    return (num > 0) && ((num & (num - 1)) == 0);
                }

                /**
                 * 常用贴图类型
                 *  { jpg, png, dds, tga ... }
                 */
                function loadTexture (url) {
                    let extIndex = url.lastIndexOf('.');
                    let ext = url.substring(extIndex + 1);
                    let texture;
                    switch (ext) {
                        case 'dds':
                            $LAB.setOptions({AlwaysPreserveOrder: true})
                                .script('/static/three/DDSLoader.js')
                                .wait(() => {
                                    let loader = new THREE.DDSLoader();
                                    texture = loader.load(url);
                                    texture.minFilter = texture.magFilter = THREE.LinearFilter;
                                });
                            break;
                        case 'tga':
                            $LAB.setOptions({AlwaysPreserveOrder: true})
                                .script('/static/three/TGALoader.js')
                                .wait(() => {
                                    let loader = new THREE.TGALoader();
                                    texture = loader.load(url);
                                    texture.minFilter = THREE.NearestFilter || THREE.LinearFilter;
                                });
                            break;
                        case 'png':
                        case 'PNG':
                        case 'jpg':
                        case 'JPG':
                        case 'jpeg':
                        case 'JPEG':
                            let loader = new THREE.TextureLoader();
                            texture = loader.load(url);
                            break;
                        default:
                            break;
                    }
                    return texture;
                }

                // 判断模型材料类型及贴图
                function judgeModuleMaterialMaps (module) {
                    module.traverse(function (child) {
                        if (child.isMesh || child.isSkinnedMesh) {
                            let material = child.material;
                            console.log('Material type: ' + material.type);
                            // 基础
                            if (material.isMeshBasicMaterial) {
                                _this.materialLibraries.hasAoMap = !!material.aoMap;
                                _this.materialLibraries.hasSpecularMap = !!material.specularMap;
                                _this.materialLibraries.hasEnvMap = !!material.envMap;
                                _this.materialLibraries.hasLightMap = !!material.lightMap;
                                _this.materialLibraries.hasAlphaMap = !!material.alphaMap;
                            }
                            // 法线
                            if (material.isMeshNormalMaterial) {
                                _this.materialLibraries.hasBumpMap = !!material.bumpMap;
                                _this.materialLibraries.hasNormalMap = !!material.normalMap;
                                _this.materialLibraries.hasDisplacementMap = !!material.displacementMap;
                            }
                            // 自发光
                            if (material.isMeshMatcapMaterial) {
                                _this.materialLibraries.hasBumpMap = !!material.bumpMap;
                                _this.materialLibraries.hasNormalMap = !!material.normalMap;
                                _this.materialLibraries.hasAlphaMap = !!material.alphaMap;
                                _this.materialLibraries.hasDisplacementMap = !!material.displacementMap;
                            }
                            // 深度，距离
                            if (material.isMeshDepthMaterial || material.isMeshDistanceMaterial) {
                                _this.materialLibraries.hasAlphaMap = !!material.alphaMap;
                                _this.materialLibraries.hasDisplacementMap = !!material.displacementMap;
                            }
                            // 兰伯特
                            if (material.isMeshLambertMaterial) {
                                _this.materialLibraries.hasAoMap = !!material.aoMap;
                                _this.materialLibraries.hasSpecularMap = !!material.specularMap;
                                _this.materialLibraries.hasEmissiveMap = !!material.emissiveMap;
                                _this.materialLibraries.hasEnvMap = !!material.envMap;
                                _this.materialLibraries.hasLightMap = !!material.lightMap;
                                _this.materialLibraries.hasAlphaMap = !!material.alphaMap;
                            }
                            // 冯氏-Phong
                            if (material.isMeshPhongMaterial) {
                                _this.materialLibraries.hasBumpMap = !!material.bumpMap;
                                _this.materialLibraries.hasAoMap = !!material.aoMap;
                                _this.materialLibraries.hasNormalMap = !!material.normalMap;
                                _this.materialLibraries.hasSpecularMap = !!material.specularMap;
                                _this.materialLibraries.hasEmissiveMap = !!material.emissiveMap;
                                _this.materialLibraries.hasEnvMap = !!material.envMap;
                                _this.materialLibraries.hasLightMap = !!material.lightMap;
                                _this.materialLibraries.hasAlphaMap = !!material.alphaMap;
                                _this.materialLibraries.hasDisplacementMap = !!material.displacementMap;
                            }
                            // 冯氏-Toon
                            if (material.isMeshToonMaterial) {
                                _this.materialLibraries.hasBumpMap = !!material.bumpMap;
                                _this.materialLibraries.hasAoMap = !!material.aoMap;
                                _this.materialLibraries.hasNormalMap = !!material.normalMap;
                                _this.materialLibraries.hasSpecularMap = !!material.specularMap;
                                _this.materialLibraries.hasEmissiveMap = !!material.emissiveMap;
                                _this.materialLibraries.hasEnvMap = !!material.envMap;
                                _this.materialLibraries.hasLightMap = !!material.lightMap;
                                _this.materialLibraries.hasAlphaMap = !!material.alphaMap;
                                _this.materialLibraries.hasDisplacementMap = !!material.displacementMap;
                                _this.materialLibraries.hasGradienMap = !!material.gradienMap;
                            }
                            // PBR
                            if (material.isMeshStandardMaterial || material.isMeshPhysicalMaterial) {
                                _this.materialLibraries.hasBumpMap = !!material.bumpMap;
                                _this.materialLibraries.hasAoMap = !!material.aoMap;
                                _this.materialLibraries.hasNormalMap = !!material.normalMap;
                                _this.materialLibraries.hasEnvMap = !!material.envMap;
                                _this.materialLibraries.hasLightMap = !!material.lightMap;
                                _this.materialLibraries.hasAlphaMap = !!material.alphaMap;
                                _this.materialLibraries.hasDisplacementMap = !!material.displacementMap;
                                _this.materialLibraries.hasGradienMap = !!material.gradienMap;
                                _this.materialLibraries.hasRoughMap = !!material.roughnessMap;
                            }
                        }
                    });
                }

                // 线框 Wireframe
                function showWireframe (child) {
                    child.material.wireframe = true;
                    // child.material.color.setStyle('rgb(255, 255, 255)');
                    child.material.wireframeLinewidth = 1;
                    child.material.map = null;
                    // child.material.normalMap = null;
                    // child.material.specularMap = null;
                }

                // 凹凸 Bump map
                function showBumpMap (child) {
                    child.material.wireframe = false;
                    child.material.map = child.material.bumpMap;
                }

                // 法线 Normal map
                function showNormalMap (child, normalTexture) {
                    child.material.wireframe = false;
                    // child.material.specularMap = null;
                    // child.material.map = null;
                    // child.material.map = normalTexture;
                    child.material.map = child.material.normalMap;
                }

                // 高光 Specular map
                function showSpecularMap (child, specularTextureMap) {
                    // child.material.normalMap = null;
                    child.material.wireframe = false;
                    // 添加高光贴图
                    // if (specularTextureMap && specularTextureMap.length > 2) {
                    //     child.material.map = specularTextureMap[ 2 ].texture;
                    // }
                    child.material.map = child.material.specularMap;
                }

                function showAllModels (child, textureMap) {
                    child.material.wireframe = false;
                    // child.material.normalMap = null;
                    // child.material.specularMap = null;
                    child.material.map = textureMap[ 0 ] ? textureMap[ 0 ].texture : null;
                }

                /**
                 * FBX 模型加载
                 */
                function loadFBXModel (url) {
                    let tgaTexture;
                    if (_this.textureList && _this.textureList.length > 0) {
                        let textureImg = _this.textureList[ 0 ].file;
                        let extIndex = textureImg.lastIndexOf('.');
                        let ext = textureImg.substring(extIndex + 1);
                        if (ext === 'tga') {
                            tgaTexture = loadTexture(textureImg) || null;
                        }
                    }
                    let loader = new THREE.FBXLoader();
                    loader.load(url, _this.path, function (object) {
                        calculationCameraAndAnimate(object);
                        object.traverse(function (child) {
                            if (child instanceof THREE.Mesh) {
                                child.castShadow = true;
                                child.receiveShadow = true;
                                if (tgaTexture) {
                                    child.material.map = tgaTexture;
                                }
                            }
                        });
                        scene.add(object);
                        urlObject = object;
                        _this.obj = urlObject;
                        judgeModuleMaterialMaps(object);
                        creatObjectInfo(object);
                    }, onProgress, onError);
                }

                /**
                 * 3DS 类型
                 */
                function load3DSModel (loadUrl) {
                    let textureMap;
                    let loader = new THREE.TDSLoader();
                    if (_this.textureList && _this.textureList.length > 0) {
                        let textureImgList = _this.textureList;
                        textureMap = textureImgList.map(item => ({
                            texture: loadTexture(item.file)
                        }));
                    }
                    loader.setPath(_this.path);
                    loader.load(loadUrl, function (tdsObj) {
                        calculationCameraAndAnimate(tdsObj);
                        tdsObj.traverse(child => {
                            if (child instanceof THREE.Mesh) {
                                if (textureMap && textureMap.length > 0) {
                                    child.material.normalMap = textureMap[ 1 ].texture;
                                }
                            }
                        });
                        scene.add(tdsObj);
                        urlObject = tdsObj;
                        _this.obj = urlObject;
                        judgeModuleMaterialMaps(tdsObj);
                        creatObjectInfo(tdsObj);
                    }, onProgress, onError);
                }

                /**
                 * Obj mtl 模型加载 （目前不支持 .mtl 格式文件上传）
                 */
                function loadObjMtlModel (url) {
                    let textUrl, clipUrl, textureFilterMap = filterTextureExt(_this.textureList);
                    let judgeIsMtl = textureFilterMap.filter(item => item.file.lastIndexOf('.mtl') !== -1);
                    if (judgeIsMtl && judgeIsMtl.length > 0) {
                        textUrl = judgeIsMtl[ 0 ].file;
                        let subUrl = textUrl.lastIndexOf('/');
                        clipUrl = textUrl.substring(0, subUrl + 1);
                        let textureName = textUrl.substring(subUrl + 1, textUrl.length);
                        let fileNum = url.lastIndexOf('/');
                        let fileName = url.substring(fileNum, url.length);
                        THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
                        $LAB.setOptions({AlwaysPreserveOrder: true})
                            .script('/static/three/MTLLoader.js')
                            .wait(() => {
                                new THREE.MTLLoader()
                                    .setPath(clipUrl)
                                    .load(textureName, function (materials) {
                                        materials.preload();
                                        new THREE.OBJLoader()
                                            .setMaterials(materials)
                                            .load(url, function (object) {
                                                calculationCameraAndAnimate(object);
                                                scene.add(object);
                                                urlObject = object;
                                                _this.obj = urlObject;
                                                judgeModuleMaterialMaps(object);
                                                creatObjectInfo(object);
                                            }, onProgress, onError);
                                    });
                            });
                    } else {
                        let textureMap;
                        if (_this.textureList && _this.textureList.length > 0) {
                            let textureImgList = _this.textureList;
                            textureMap = textureImgList.map(item => ({
                                texture: loadTexture(item.file)
                            }));
                        }
                        let loader = new THREE.OBJLoader();
                        loader
                            // .setPath(_this.path)
                            .load(url, function (objObject) {
                                calculationCameraAndAnimate(objObject);
                                objObject.traverse(function (child) {
                                    if (child instanceof THREE.Mesh) {
                                        if (textureMap && textureMap.length > 0) {
                                            child.material.map = textureMap[ 0 ].texture;
                                        }
                                    }
                                });
                                scene.add(objObject);
                                urlObject = objObject;
                                _this.obj = urlObject;
                                judgeModuleMaterialMaps(objObject);
                                creatObjectInfo(objObject);
                            }, onProgress, onError);
                    }
                }

                /**
                 * Json 格式模型加载
                 */
                function loadJsonModel (url) {
                    let objectLoader = new THREE.ObjectLoader();
                    let textureImgList = _this.textureList;
                    let textureMap = textureImgList.map(item => ({
                        texture: loadTexture(item.file)
                    }));
                    objectLoader.load(url, function (obj) {
                        calculationCameraAndAnimate(obj);
                        obj.traverse(function (child) {
                            if (child instanceof THREE.Mesh) {
                                if (textureMap && textureMap.length > 0) {
                                    child.material.map = textureMap[ 0 ].texture;
                                }
                            }
                        });
                        scene.add(obj);
                        urlObject = obj;
                        _this.obj = urlObject;
                        judgeModuleMaterialMaps(obj);
                        creatObjectInfo(obj);
                    }, onProgress, onError);
                }

                /**
                 * Json 格式模型加载2 （目前不支持 .js 格式文件上传）
                 */
                function loadJsModel (url) {
                    let jsonLoader = new THREE.JSONLoader();
                    jsonLoader.load(url, function (geometry, materials) {
                        let obj = new THREE.Mesh(geometry, materials);
                        calculationCameraAndAnimate(obj);
                        scene.add(obj);
                        urlObject = obj;
                        _this.obj = urlObject;
                        judgeModuleMaterialMaps(obj);
                        creatObjectInfo(obj);
                    }, onProgress, onError);
                }

                /**
                 * Stl 格式模型
                 */
                function loadStlModel (url) {
                    let textureImgList = _this.textureList;
                    let textureMap = textureImgList.map(item => ({
                        texture: loadTexture(item.file)
                    }));
                    $LAB.setOptions({AlwaysPreserveOrder: true})
                        .script('/static/three/STLLoader.js')
                        .wait(() => {
                            let stlLoader = new THREE.STLLoader();
                            stlLoader.load(url, function (geometry) {
                                let material = new THREE.MeshStandardMaterial();
                                let mesh = new THREE.Mesh(geometry, material);
                                calculationCameraAndAnimate(mesh);
                                mesh.traverse(function (child) {
                                    if (child instanceof THREE.Mesh) {
                                        if (textureMap && textureMap.length > 0) {
                                            child.material.map = textureMap[ 0 ].texture;
                                        }
                                    }
                                });
                                scene.add(mesh);
                                urlObject = mesh;
                                _this.obj = urlObject;
                                judgeModuleMaterialMaps(mesh);
                                creatObjectInfo(mesh);
                            }, onProgress, onError);
                        });

                }
                //增加动画控制器
                function object_addAnimateControl (object) {
                    if (object.animations && object.animations.length > 0) {
                        _this.isAnimate = true;
                        _this.showSpeedActive = true;
                        object.mixer = new THREE.AnimationMixer(object);
                        mixers.push(object.mixer);
                        _this.objMix = object.mixer;
                        object.mixer.clipAction(object.animations[ 0 ]).play();
                        object_addSkeletonHelp(object);//骨骼助手
                        createAnimateGui(object);//动画UI
                    }
                }

                //生成物体骨骼
                function object_addSkeletonHelp (object) {
                    skeletonShow = new THREE.SkeletonHelper(object);
                    skeletonShow.material.linewidth = 1.5;
                    skeletonShow.visible = true;
                    scene.add(skeletonShow);
                }

                //根据物体大小调整镜头
                function object_fixCamera (object) {
                    let box = new THREE.Box3();
                    // box.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1));
                    // let helper = new THREE.Box3Helper(box, 0xffff00);
                    // scene.add( helper );
                    box.expandByObject(object);
                    boxRange.x = parseFloat(box.max.x);
                    boxRange.y = parseFloat(box.max.y);
                    boxRange.z = parseFloat(box.max.z);
                    let aspect = parseFloat(box.max.y) / parseFloat(box.max.z);
                    let cameraPositionZ = 0;
                    if (aspect <= 1) {
                        cameraPositionZ = parseFloat(box.max.z) * 2 > 5 ? parseFloat(box.max.z) * 2 : 5;
                    } else {
                        cameraPositionZ = parseFloat(box.max.y) * 2 > 5 ? parseFloat(box.max.y) * 2 : 5;
                    }
                    camera.position.set(0, parseFloat(box.max.y) / 2, cameraPositionZ);
                    console.log(boxRange);
                    object_initController(object);
                }

                function object_initController (urlObject) {
                    //轨道控制插件
                    controls = new THREE.OrbitControls(camera, document.getElementById('mainId'));
                    controls.target.set(urlObject.position.x, urlObject.position.y + boxRange.y / 2, urlObject.position.z);
                    // controls.zoom0 = 2;
                    // controls.target.set(0,0,0);
                    controls.update();
                    _this.threeDControl = controls;
                }

                // 滚动鼠标计算屏幕长度与世界长度的变化转换到对应的标注点
                function mouseWheel(e) {
                    e.preventDefault();
                    let mainContainerDom = document.querySelector('#mainContainer');
                    let signBoxDom = document.querySelector('.sign-content-box');
                    let signPointDoms = document.querySelectorAll('.sign-point-num');
                    let dataId = signBoxDom.getAttribute('data-id');
                    let shiftCurrentPoint;
                    for (let item of signPointDoms) {
                        if (item.innerText === dataId) {
                            shiftCurrentPoint = item;
                        }
                    }
                    let mainRect = mainContainerDom.getBoundingClientRect();
                    if (shiftCurrentPoint) {
                        let currentPointRect = shiftCurrentPoint.getBoundingClientRect();
                        signBoxDom.style.top = currentPointRect.top - mainRect.top + 'px';
                        signBoxDom.style.left = currentPointRect.left - mainRect.left + currentPointRect.width + 5 + 'px';
                    }
                    for (let sign of signTexts) {
                        let scale = ndcCompareScreenScale(sign.position);
                        sign.scale.x = scale;
                        sign.scale.y = scale;
                    }
                }
                let canvas = document.getElementById('mainContainer');
                canvas.addEventListener('mousewheel', mouseWheel, false);

                function createAnimateGui (object) {
                    _this.isAnimationShow = true;

                    let anime_frame = object.animations[ 0 ].tracks.length;
                    let anime_time = object.animations[ 0 ].duration;
                    totalTimes = anime_time;

                    urlAnimate.time = anime_time;
                    urlAnimate.frame = anime_frame;
                    urlAnimate.framerate = anime_frame / anime_time;//这里有可能不足一秒
                    urlAnimate.perframe = anime_time / anime_frame;

                    _this.animationProgressData.max = anime_time * 10000;
                    // document.querySelector('#menu_progress').style.top = mainbouding.height
                    //     - 36 + 'px';//40为div宽度
                    // document.querySelector('#menu_progress').style.width = mainbouding.width
                    //     + 'px';//40为div宽度

                    let playButton = document.createElement('button');
                    playButton.id = 'progress_button';
                    let playEle = '', pauseEle = '';
                    playEle += '<i class="play-icon iconfonts icon-bofang"></i>';
                    pauseEle += '<i class="pause-icon iconfonts icon-pause"></i>';
                    // button_2.innerHTML  = "暂停";
                    playButton.innerHTML = pauseEle;
                    playButton.addEventListener('click', function () {
                        let bonesClip = urlObject.animations[ 0 ];
                        let action = urlObject.mixer.clipAction(bonesClip, null);

                        playButton.innerHTML = action.paused ? pauseEle : playEle;
                        if (action.paused)//已暂停,点击后继续播放
                        {
                            _this.clock.start();
                            _this.showSpeedActive = true;
                            if (_this.animationProgressData.value) {
                                _this.clock.elapsedTime = _this.animationProgressData.value;
                                urlObject.mixer._actions[ 0 ].time = _this.clock.elapsedTime;
                            } else {
                                _this.clock.elapsedTime = _this.animationProgressData.timeNow;
                            }
                        } else//未暂停,点击后暂停
                        {
                            _this.showSpeedActive = false;
                            _this.animationProgressData.timeNow = _this.clock.elapsedTime;
                            _this.clock.stop();
                        }
                        action.paused = !action.paused;
                    });
                    menu_progress.appendChild(playButton);

                    let progress = document.createElement('div');
                    progress.type = 'range';
                    progress.id = 'three_progress';
                    progress.value = 50;

                    let dragbutton = document.createElement('div');
                    // var lineDiv_left = getPosition(progress).left; //长线条的横坐标
                    dragbutton.id = 'progress_drag_button';
                    _this.animationProgressData.button = dragbutton;
                    _this.animationProgressData.max = mainbouding.width;
                    _this.animationProgressData.pervalue = _this.animationProgressData.max / urlAnimate.time;//每秒多少像素
                    beginPervalue = _this.animationProgressData.pervalue;

                    let currentProgressTimeEle = document.createElement('span');
                    currentProgressTimeEle.className = 'current-progress-time';
                    progress.appendChild(currentProgressTimeEle);

                    progress.addEventListener('mousedown', function (e) {
                        e.stopPropagation();
                        progress_drag_button_bool = true;
                        let progressBarEle = $('#three_progress');
                        let progressBarWidth = progressBarEle[ 0 ].clientWidth;
                        let minDiv_left = e.clientX - mainLeft - progress.offsetLeft;

                        if (minDiv_left < 0) {
                            minDiv_left = 0;
                        }
                        if (minDiv_left >= progressBarWidth) {
                            minDiv_left = progressBarWidth;
                        }
                        _this.animationProgressData.value = minDiv_left * _this.animationProgressData.pervalue;
                        _this.clock.elapsedTime = (minDiv_left / _this.animationProgressData.pervalue);
                        urlObject.mixer._actions[ 0 ].time = (minDiv_left / _this.animationProgressData.pervalue);
                        document.getElementById('progress_drag_button').style.left = minDiv_left + 'px!important';
                    }, false);

                    progress.addEventListener('mousemove', function (e) {
                        let progressBarEle = $('#three_progress');
                        let progressBarWidth = progressBarEle[ 0 ].clientWidth;

                        if (progress_drag_button_bool) {
                            let minDiv_left = e.clientX - mainLeft - progress.offsetLeft - 5;
                            if (minDiv_left < 0) {
                                minDiv_left = 0;
                            }
                            // if(minDiv_left > _this.animationProgressData.max)
                            if (minDiv_left >= progressBarWidth) {
                                minDiv_left = progressBarWidth - 10;
                            }
                            _this.animationProgressData.value = minDiv_left * _this.animationProgressData.pervalue;
                            _this.clock.elapsedTime = minDiv_left / (_this.animationProgressData.pervalue);
                            urlObject.mixer._actions[ 0 ].time = (minDiv_left / _this.animationProgressData.pervalue);
                            dragbutton.style.left = minDiv_left + 'px!important';
                            // debugger;
                        }
                    }, false);
                    progress.addEventListener('mouseup', function (e) {
                        // e.stopPropagation();
                        progress_drag_button_bool = false;
                    }, false);

                    progress.appendChild(dragbutton);
                    menu_progress.appendChild(progress);

                    let totalTimeEle = document.createElement('span');
                    totalTimeEle.className = 'total-time';
                    let timeNum = parseInt(urlAnimate.time);
                    let innerNum = '';
                    if (timeNum) {
                        if (timeNum < 60) {
                            innerNum += '00:' + timeNum;
                        } else if (timeNum >= 60 && timeNum < 3600) {
                            let minute = parseInt(timeNum / 60);
                            let seconds = timeNum % 60;
                            minute = (Array(2)
                                .join("0") + minute).slice(-2);
                            seconds = (Array(2)
                                .join("0") + seconds).slice(-2);
                            innerNum += minute + ':' + seconds;
                        }
                    }
                    totalTimeEle.innerHTML = '<label class="time-line">/</label>' + innerNum;
                    progress.appendChild(totalTimeEle);
                }

                //获取元素的绝对位置
                function getPosition (node) {
                    let left = node.offsetLeft; //获取元素相对于其父元素的left值var left
                    let top = node.offsetTop;
                    let current = node.offsetParent; // 取得元素的offsetParent
                    // 一直循环直到根元素
                    while (current != null) {
                        left += current.offsetLeft;
                        top += current.offsetTop;
                        current = current.offsetParent;
                    }
                    return {
                        'left': left,
                        'top': top
                    };
                }

                function checkMesh (node) {
                    let child = node.children,
                        arr = [];
                    if (child) {
                        child.forEach(function (node) {
                            if (node.type == 'SkinnedMesh' || node.type == 'Mesh') {
                                arr = arr.concat(node);
                            } else {
                                arr = arr.concat(checkMesh(node));
                            }
                        });
                    }
                    return arr;
                }

                function creatObjectInfo (object3d) {
                    let info = document.getElementById('info');
                    let _info_list = [
                        {name: i18n.t('lang.lang_name')+'： ', at: 'name'},
                        {name: i18n.t('project.pro_twoAxes')+'： ', at: 'position'},
                        {name: i18n.t('project.pro_sizeRatio')+'： ', at: 'scale'},
                        // {name:'动作数量 ： ',at:'animations.length'},
                        {name: i18n.t('project.pro_coordinateAxisType')+'： ', at: 'rotation._order'}
                    ];
                    let _list = document.createElement('ul');
                    _list.className = 'attribute-list';
                    for (let i = 0; i < _info_list.length; i++) {
                        let _attribute;
                        try {
                            _attribute = eval('JSON.stringify(object3d.' + _info_list[ i ].at + ')');
                        } catch (exception) {
                            _attribute = '';
                        }
                        let _l = document.createElement('li');
                        _l.innerHTML = _info_list[ i ].name + _attribute;
                        _list.appendChild(_l);
                    }
                    let _meshObject = checkMesh(object3d);
                    if (_meshObject) {
                        for (let k = 0; k < _meshObject.length; k++) {
                            if (_meshObject[ k ].type !== 'Mesh') {
                                let _num = (_meshObject.length <= 1) ? '' : (k + 1);

                                let _l1 = document.createElement('li');
                                _l1.innerHTML = i18n.t('project.pro_faceNumber')+ _num + ' ： ' + _meshObject[ k ].geometry.attributes.faceLength.array;
                                _list.appendChild(_l1);
                                _l1 = document.createElement('li');
                                _l1.innerHTML = i18n.t('project.pro_numberOfVertex') + _num + ' ： ' + _meshObject[ k ].geometry.attributes.vertsLenght.array;
                                _list.appendChild(_l1);
                                if (_meshObject[ k ].skeleton) {
                                    _l1 = document.createElement('li');
                                    _l1.innerHTML = i18n.t('project.pro_boneQuantity') + _num + ' ：' + _meshObject[ k ].skeleton.boneInverses.length;
                                    _list.appendChild(_l1);
                                    _this.showSkeletonCtrl = true;
                                }
                                if (_meshObject[ k ].material.length) {
                                    for (let j = 0; j < _meshObject[ k ].material.length; j++) {
                                        let _subnum = (_meshObject[ k ].material.length <= 1) ? '' : (j + 1);
                                        addMeshInfo(_list, _meshObject[ k ].material[ j ], _subnum);
                                    }
                                } else {
                                    addMeshInfo(_list, _meshObject[ k ], _num);
                                }
                            }
                        }
                    }
                    if (_list && _list.childNodes.length > 0) {
                        info.appendChild(_list);
                        $('#info .toggle-menu')
                            .css('display', 'block');
                    } else {
                        $('#info .toggle-menu')
                            .css('display', 'none');
                    }
                    _this.loadedParams.loadedPercent = 100;
                    _this.resourceCompleteLoading = false;
                    showSign(_this.signData);  // 显示获取到的标记
                }

                function addMeshInfo (_list, _object, _num) {
                    let _meshObject;
                    if (_object.material) {
                        _meshObject = _object.material;
                    } else {
                        _meshObject = _object;
                    }
                    let _l1 = document.createElement('li');
                    _l1.innerHTML = i18n.t('project.pro_material')+ _num + ' ： ' + _meshObject.name;
                    _list.appendChild(_l1);
                    if (_meshObject.map && _meshObject.map.RelativeFilename) {
                        let _l1 = document.createElement('li');
                        let _fileNameArr = _meshObject.map.RelativeFilename.split('\\');
                        let _fileName = _fileNameArr[ _fileNameArr.length - 1 ];
                        _l1.innerHTML = i18n.t('project.pro_textureName') + _num + ' ： ' + _fileName;
                        _list.appendChild(_l1);
                        let t = new Image();
                        let name = _meshObject.map.RelativeFilename || '';
                        let addrLast = '';
                        if (name.indexOf('\\') != -1) {
                            let index = name.lastIndexOf('\\');
                            //js 获取字符串中最后一个斜杠后面的内容
                            addrLast = decodeURI(name.substring(index + 1, name.length));
                        } else {
                            addrLast = name;
                        }
                        t.src = file_BaseUrl + addrLast;
                        t.onload = function () {
                            let _l1 = document.createElement('li');
                            if (_meshObject.map && _meshObject.map.image) {
                                _l1.innerHTML = i18n.t('project.pro_textureSize')+ _num + ' : ' + _meshObject.map.image.height +
                                    '*' +
                                    _meshObject.map.image.width;
                            }

                            _list.appendChild(_l1);
                        };
                    }
                }

                function createGui () {
                    // var printBtn = document.createElement('button');
                    // printBtn.id = 'three_button';
                    // printBtn.innerHTML = '打印属性';
                    // printBtn.addEventListener('click', function () {
                    //     console.log(controls.getAzimuthalAngle());
                    //     console.log(controls.getPolarAngle());
                    //     console.log(controls);
                    //     console.log(urlObject);
                    //     console.log(boxRange);
                    //     console.log(camera.position);
                    // });
                    // menu_1.appendChild(printBtn);

                    let menuContainer = document.getElementById('menuBar');
                    let _option = [
                        {_value: 'left_45', _innerHTML: i18n.t('project.pro_leftTopView'), _posx: 4, _posy: 0},
                        {_value: 'right_45', _innerHTML: i18n.t('project.pro_rightTopView'), _posx: -4, _posy: 0},
                        {_value: 'front', _innerHTML: i18n.t('project.pro_frontView'), _posx: 0, _posy: -9},
                        {_value: 'back', _innerHTML: i18n.t('project.pro_behindView'), _posx: 1, _posy: -9},
                        {_value: 'left', _innerHTML: i18n.t('project.pro_frontLeftView'), _posx: 2, _posy: -9},
                        {_value: 'right', _innerHTML: i18n.t('project.pro_frontRightView'), _posx: -2, _posy: -9},
                        {_value: 'top', _innerHTML: i18n.t('project.pro_frontTopView'), _posx: 0, _posy: 2},
                    ];
                    for (let i = 0; i < _option.length; i++) {
                        let option = document.createElement('button');
                        option.className = 'three_button';
                        option.value = _option[ i ]._value;
                        option.innerHTML = _option[ i ]._innerHTML;
                        option.posx = _option[ i ]._posx;
                        option.posy = _option[ i ]._posy;
                        option.addEventListener('click', function (o) {
                            controls.outSetRotateZero();
                            controls.reset();
                            controls.outSetRotateLeft((o.srcElement.posx == 0) ? 0 : (Math.PI / o.srcElement.posx));
                            controls.outSetRotateUp((o.srcElement.posy == 0) ? 0 : (Math.PI / o.srcElement.posy));
                            controls.outPan(0, boxRange.y / 4);
                            controls.update();
                        });
                        menuContainer.appendChild(option);
                    }
                }

                function checkObjectMesh (obj) {
                    let objs = [];
                    for (let i = 0; i < obj.children.length; i++) {
                        if (obj.children[ i ].type == 'Mesh') {
                            objs.push(obj.children[ i ]);
                        } else {
                            if (obj.children[ i ].children.length > 0) {
                                let childrens = checkObjectMesh(obj.children[ i ]);
                                for (let j = 0; j < childrens.length; j++) {
                                    objs.push(childrens[ j ]);
                                }
                            }
                        }
                    }
                    return objs;
                }

                //初始化
                function init (url) {
                    //获得div并添加容器
                    container = document.createElement('div');
                    container.id = 'mainContainer';
                    document.getElementById('mainId').appendChild(container);
                    //设置相机(可视角度,canvas宽高比,近距离,远距离)
                    // let _width = container.width;
                    // let _height = container.height;
                    // console.log(document.getElementById("mainId").offsetWidth,document.getElementById("mainId").offsetHeight);
                    camera = new THREE.PerspectiveCamera(60, document.getElementById('mainId').offsetWidth / document.getElementById('mainId').offsetHeight, 1, 8000);
                    // camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
                    camera.position.set(0, 200, 300);
                    camera.lookAt({x: 0, y: 1, z: 0});
                    //场景
                    scene = creatScene();
                    _this.scene = scene;
                    //加载
                    loadModel(url);
                    //渲染
                    initRender();
                    //UI
                    createGui();
                    _this.windowResize = onWindowResize();
                    window.addEventListener('resize', onWindowResize, false);
                }

                //初始化渲染组件
                function initRender () {
                    //render1初始化
                    renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
                    renderer.setPixelRatio(window.devicePixelRatio);
                    renderer.setSize(document.getElementById('mainId').offsetWidth, document.getElementById('mainId').offsetHeight);
                    renderer.shadowMap.enabled = true;
                    renderer.domElement.className = 'canvas-container';
                    renderer.domElement.addEventListener('dblclick', onDocumentMouseDown, true);
                    container.appendChild(renderer.domElement);
                    //render2初始化
                    renderer2 = new THREE.CSS3DRenderer();
                    renderer2.setSize(document.getElementById('mainId').offsetWidth, document.getElementById('mainId').offsetHeight);
                    renderer2.domElement.style.position = 'absolute';
                    renderer2.domElement.style.top = 0;
                    renderer2.domElement.className = 'signcover';
                    renderer2.domElement.style.zIndex = 1;
                    container.appendChild(renderer2.domElement);
                    renderer2.domElement.addEventListener('dblclick', onDocumentMouseDown, true);
                    _this.renderer = renderer;
                }

                let ratio = null;
                let signIntersects = null;

                // 鼠标双击左键标注
                function onDocumentMouseDown (e) {
                    if (_this.isSignPermission) {
                        _this.canEditSignContent = true;
                        if (urlObject.animations && urlObject.animations.length > 0) {
                            // 双击标注动画暂停
                            let playEle = '<i class="play-icon iconfonts icon-bofang"></i>';
                            _this.animationProgressData.timeNow = _this.clock.elapsedTime;
                            _this.clock.stop();
                            //暂停时同时停止坐标刷新
                            _this.showSpeedActive = false;
                            let bonesClip = urlObject.animations[ 0 ];
                            let action = urlObject.mixer.clipAction(bonesClip, null);
                            action.paused = !action.paused;
                            document.getElementById('progress_button').innerHTML = playEle;
                        }

                        let rect = renderer2.domElement.getBoundingClientRect();
                        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
                        ratio = e.clientX / mouse.x;
                        e.preventDefault();
                        let vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
                        let raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
                        // var raycaster = new THREE.Raycaster();
                        raycaster.setFromCamera(mouse, camera);
                        let intersects = raycaster.intersectObjects(urlObject.children, true);
                        signIntersects = intersects;
                        if (intersects.length > 0) {
                            if (intersects[ 0 ].object.type == 'Mesh' || intersects[ 0 ].object.type == 'SkinnedMesh') {
                                showText(intersects[ 0 ], mouse, camera, rect);
                            }
                        }
                    }
                }

                // 点击标记点显示标记内容
                let indexId = 0, x, y, z, removeId, removeHtml, cameraX, cameraY, cameraZ, numId;
                $(document).off('click', '[id*=Ts]')
                    .on('click', '[id*=Ts]', function (e) {
                        e.stopPropagation();
                        let m = $(this).attr('id').replace(/[^0-9]/ig, '');
                        let signBox = document.querySelector('.sign-content-box');
                        let signTextArea = document.querySelector('.sign-content-box .edit-sign-content');
                        let mainContainerDom = document.querySelector('#mainContainer');
                        let signPointDoms = document.querySelectorAll('.sign-point-num');
                        signBox.setAttribute('data-id', m);
                        let shiftCurrentPoint;
                        for (let item of signPointDoms) {
                            if (item.innerText === m) {
                                shiftCurrentPoint = item;
                            }
                        }
                        if (e.target.className.indexOf('sign-point-num') !== -1) {
                            numId = e.target.innerText;
                            signNum = numId;
                            let matchedData = _this.signedDataList.filter(item => Number(numId) === Number(item.index));
                            if (_this.isSignPermission) {
                                signTextArea.value = matchedData[0] ? matchedData[0].message : '';
                            } else {
                                _this.canEditSignContent = false;
                                let signedContentDom = document.querySelector('.show-sign-content');
                                signedContentDom.innerText = matchedData[0].message;
                            }
                            cameraX = matchedData[0].cameraPos.x;
                            cameraY = matchedData[0].cameraPos.y;
                            cameraZ = matchedData[0].cameraPos.z;
                            camera.position.x = Number(cameraX);
                            camera.position.y = Number(cameraY);
                            camera.position.z = Number(cameraZ);
                            signBox.style.display = 'block';
                            let mainRect = mainContainerDom.getBoundingClientRect();
                            let currentPointRect = shiftCurrentPoint.getBoundingClientRect();
                            signBox.style.top = currentPointRect.top - mainRect.top + 'px';
                            signBox.style.left = currentPointRect.left - mainRect.left + currentPointRect.width + 10 + 'px';
                            renderer.render(scene, camera);
                            renderer2.render(scene, camera);
                            signPos = matchedData[0].pointPos;
                            for (let sign of signTexts) {
                                let scale = ndcCompareScreenScale(sign.position);
                                sign.scale.x = scale;
                                sign.scale.y = scale;
                            }
                            e.stopPropagation();
                        }
                    });

                $(".sign-content-box").on("click", function(e) {
                    if (e && e.stopPropagation) {
                        e.stopPropagation();
                    } else {
                        e.cancelBubble = true;
                    }
                });

                $(document).mouseup(function(e) {
                    let pop = $('.sign-content-box');
                    if (!pop.is(e.target) && pop.has(e.target).length === 0) {
                        pop.css("display", "none");
                    }
                });

                /**
                 * 循环获取标记内容根据时间线进行渲染
                  */
                function renderSignData (data) {
                    let signDoms = document.querySelectorAll('.sign-point-num');
                    if (data && data.length > 0) {
                        for (let item of data) {
                            for (let opt of signDoms) {
                                opt.style.display = 'none';
                                if (item.signTime === _this.clock.elapsedTime) {
                                    let signedNum = opt.innerText;
                                    if (Number(signedNum) === Number(item.index)) {
                                        opt.style.display = 'block';
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }

                // 点击进度条标记点
                $(document).off('click', '[id*=timeSign]')
                    .on('click', '[id*=timeSign]', function (e) {
                        e.stopPropagation();
                        let signTime = $(this).attr('signTime');
                        _this.clock.stop();
                        let bonesClip = urlObject.animations[ 0 ];
                        let action = urlObject.mixer.clipAction(bonesClip, null);
                        action.paused = true;
                        let playEle = '<i class="play-icon iconfonts icon-bofang"></i>';
                        document.getElementById('progress_button').innerHTML = playEle;
                        setTimeout(() => {
                            _this.clock.elapsedTime = Number(signTime);
                        }, 100);
                    });

                // 添加标记
                function addSigns (indexId, type, item) {
                    let signTime = _this.clock.elapsedTime;
                    let timeAxis = document.getElementById('three_progress');
                    let progressRect = timeAxis.getBoundingClientRect();
                    let timeLineSignDom = document.createElement('span');
                    timeLineSignDom.id = 'timeSign' + indexId;
                    timeLineSignDom.className = 'time-line-dot';
                    if (type === 'add') {
                        timeLineSignDom.setAttribute('sign-index', indexId);
                        timeLineSignDom.setAttribute('signTime', signTime);
                    }
                    if (type === 'detail' && item) {
                        signTime = item.signTime;
                        timeLineSignDom.setAttribute('sign-index', item.index);
                        timeLineSignDom.setAttribute('signTime', signTime);
                    }
                    let signNumberDom = document.createElement('span');
                    signNumberDom.className = 'sign-number';
                    signNumberDom.innerText = indexId;
                    timeLineSignDom.style.left = (progressRect.width * signTime / urlAnimate.time - 6) + 'px';
                    timeLineSignDom.appendChild(signNumberDom);
                    timeAxis.appendChild(timeLineSignDom);
                }

                // ndc坐标转化为平面坐标
                function ndcToScreen (position, rect) {
                    screenMatrix = {
                        sx: (position.x + 1) * rect.width / 2,
                        sy: (1 - position.y) * rect.height / 2
                    };
                    return screenMatrix;
                }

                // 平面坐标转化为ndc坐标
                function screenToNdc (screen, rect) {
                    return {
                        nx: screen.x / rect.width * 2 - 1,
                        ny: -screen.y / rect.height * 2 + 1,
                        nz: 1
                    };
                }

                // 计算3d 世界与屏幕长度比
                function ndcCompareScreenScale (position) {
                    let innerHeight = document.getElementById('mainId').getBoundingClientRect().height;
                    let pos = position || controls.target;
                    let distance = camera.position.distanceTo(pos);
                    let top = Math.tan(camera.fov / 2 * Math.PI / 180) * distance;
                    let meter = 2 * top / innerHeight;
                    let scale = 1.2 * meter;
                    return scale;
                }

                // 添加标记点方法
                let signPos, signNum;
                function addSignPoint (point, num) {
                    let signEle = document.createElement('div');
                    signEle.className = 'sign-container';
                    signEle.innerHTML = '<div class="sign-point-num" id="Ts' + num + '">' + num + '</div>';
                    signPos = {
                        x: point.x,
                        y: point.y,
                        z: point.z
                    };
                    signNum = num;
                    let signPointObj = new THREE.CSS3DObject(signEle);
                    signPointObj.position.x = point.x;
                    signPointObj.position.y = point.y;
                    signPointObj.position.z = point.z;
                    signPointObj.rotation.x = camera.rotation.x;
                    signPointObj.rotation.y = camera.rotation.y;
                    signPointObj.rotation.z = camera.rotation.z;
                    signPointObj.cameraPos = camera.position;
                    signPointObj.name = 'sign' + num;
                    let scale = ndcCompareScreenScale(signPointObj.position);
                    signPointObj.scale.x = scale;
                    signPointObj.scale.y = scale;
                    if (signPointObj.name && signPointObj.name.length > 0) {
                        scene.add(signPointObj);
                    }
                    signTexts.push(signPointObj);
                    // _this.$store.commit('calculateSignSum', signTexts.length);
                    return signPointObj;
                }

                /**
                 *
                 * @type {Element}
                 */
                function deleteTimeAxisPoint (num) {
                    let timeSignDoms = document.querySelectorAll('.time-line-dot');
                    let len = timeSignDoms.length;
                    while (len--) {
                        let index = timeSignDoms[len].getAttribute('sign-index');
                        if (Number(index) === Number(num)) {
                            timeSignDoms[len].remove();
                        }
                    }
                    timeSignDoms = document.querySelectorAll('.time-line-dot');
                    timeSignDoms.forEach((dom, index) => {
                        dom.setAttribute('id', 'timeSign' + (index + 1));
                        dom.setAttribute('sign-index', (index + 1));
                        dom.children[0].innerText = index + 1;
                    });
                }

                // 点击取消标记框
                let cancelSignDom = document.querySelector('.cancel-sign-btn');
                cancelSignDom.addEventListener('click', function () {
                    let signBox = document.querySelector('.sign-content-box');
                    let signTextArea = document.querySelector('.sign-content-box .edit-sign-content');
                    signTextArea.value = '';
                    signBox.style.display = 'none';
                    removeSign(signNum);
                    if (_this.isAnimate) {
                        deleteTimeAxisPoint(signNum);
                    }
                    // 移除sessionStorage.threeData中的值
                    deleteData(signPos.x, signPos.y, signPos.z);
                }, false);

                let confirmAddSign = function () {
                    let signTextArea = document.querySelector('.sign-content-box .edit-sign-content');
                    signedData[ signedData.length ] = {
                        pointPos: signedPointObj.position,
                        cameraPos: signedPointObj.cameraPos,
                        message: signTextArea.value,
                        rotationPos: signedPointObj.rotation,
                        index: signedData.length + 1,
                        signTime: _this.clock.elapsedTime
                    };
                    numId = signedData.length;
                    sessionStorage.threeData = JSON.stringify(signedData);
                    _this.signedDataList = signedData;
                    if (_this.isAnimate) {
                        addSigns(signedData.length, 'add', null);
                    }
                    signTextArea.value = '';
                    _this.$store.commit('calculateSignSum', signTexts.length);
                };

                // 点击确定标记
                let confirmSignDom = document.querySelector('.confirm-sign-btn');
                confirmSignDom.addEventListener('click', function () {
                    let signBox = document.querySelector('.sign-content-box');
                    let signTextArea = document.querySelector('.sign-content-box .edit-sign-content');
                    let updateSignedData = signedData.filter(item => Number(item.index) === Number(numId));
                    if (updateSignedData && updateSignedData.length > 0) {
                        let signIndex = updateSignedData[0].index;
                        signedData[signIndex - 1].message = signTextArea.value;
                    } else {
                        signedData[ signedData.length ] = {
                            pointPos: signedPointObj.position,
                            cameraPos: signedPointObj.cameraPos,
                            message: signTextArea.value,
                            rotationPos: signedPointObj.rotation,
                            index: signedData.length + 1,
                            signTime: _this.clock.elapsedTime
                        };
                    }
                    sessionStorage.threeData = JSON.stringify(signedData);
                    _this.signedDataList = signedData;
                    signTextArea.value = '';
                    signBox.style.display = 'none';
                    // _this.$store.commit('calculateSignSum', signTexts.length);
                }, false);

                // 标记编辑框
                let signedPointObj = null;
                function showText (intersects, mouse, camera, rect) {
                    indexId = signedData.length + 1;
                    let signedPointContent = addSignPoint(intersects.point, indexId);
                    signedPointObj = {
                        cameraPos: {
                            x: signedPointContent.cameraPos.x,
                            y: signedPointContent.cameraPos.y,
                            z: signedPointContent.cameraPos.z,
                        },
                        position: {
                            x: signedPointContent.position.x,
                            y: signedPointContent.position.y,
                            z: signedPointContent.position.z,
                        },
                        rotation: {
                            x: signedPointContent.rotation.x,
                            y: signedPointContent.rotation.y,
                            z: signedPointContent.rotation.z,
                        }
                    };
                    let signBoxDom = document.querySelector('.sign-content-box');
                    let signTextArea = document.querySelector('.sign-content-box .edit-sign-content');
                    signTextArea.value = '';
                    signBoxDom.style.display = 'block';
                    signBoxDom.setAttribute('data-id', indexId);
                    let {sx, sy} = ndcToScreen(mouse, rect);
                    signBoxDom.style.top = sy - 10 + 'px';
                    signBoxDom.style.left = sx + 10 + 'px';
                    confirmAddSign();
                }

                // 删除标记记录
                function deleteData (x, y, z) {
                    let signNodes = document.querySelectorAll('.sign-point-num');
                    for (let i = 0; i < signedData.length; i++) {
                        if (signedData[ i ].pointPos.x === x && signedData[ i ].pointPos.y === y && signedData[ i ].pointPos.z === z) {
                            signedData.splice(i, 1);
                            signedData.forEach((item, index) => {
                                item.index = index + 1;
                            });
                            signNodes.forEach((opt, thumb) => {
                                opt.setAttribute('id', 'Ts' + (thumb + 1));
                                opt.innerHTML = thumb + 1;
                            });
                            sessionStorage.threeData = JSON.stringify(signedData);
                            _this.$store.commit('calculateSignSum', signedData.length);
                        }
                    }
                }

                // 从场景中移除标注
                function removeSign (signNum) {
                    let name = 'sign' + signNum;
                    for (let i = 0; i < signTexts.length; i++) {
                        if (signTexts[ i ] && signTexts[ i ].name === name) {
                            let htmlSign = scene.getObjectByName(signTexts[ i ].name);   // 获取特定name的物体对象
                            signTexts.splice(i, 1);
                            signTexts.forEach((item, index) => {
                                item.name = 'sign' + (index + 1);
                            });
                            scene.remove(htmlSign);
                        }
                    }

                    // 清除标记点
                    // for (let j in textMap) {
                    //     if (textMap[ j ]._id === name) {
                    //         textMap.splice(j, 1);
                    //         textMap.forEach((item, index) => {
                    //             item._id = 'sign' + (index + 1);
                    //         });
                    //     }
                    // }
                }

                // 调用接口获取到标记并显示标记
                function showSign (signObj) {
                    let getShowSign = null;
                    if (_this.taskInfos.isTestTask) {
                        getShowSign = JSON.parse(signObj.tag);
                    } else {
                        if (signObj && signObj.file) {
                            getShowSign = signObj.tag;
                        }
                    }
                    _this.signedDataList = getShowSign;
                    if (getShowSign) {
                        getShowSign.forEach((item, index) => {
                            getSignText(item, (index + 1));
                        });
                    }
                }

                //创建和处理标记
                function disposeHotpost (_intersects, pointText, indexId) {
                    let object = creatHotpost(_intersects, pointText, indexId);

                    object._text.position.x = 0;
                    object._text.position.y = 0;
                    object._text.position.z = 0;
                    //场景显示
                    scene.add(object._text);
                    //标记合集，用于处理多个标记
                    textMap.push(object);
                }

                //创建复合标记对象
                function creatHotpost (_intersects, pointText, indexId) {
                    //建立复合对象
                    let object = new THREE.Object3D();
                    // let contentText = $.trim($('.signbox').text());
                    if (indexId) {
                        object._id = 'sign' + indexId;
                    }
                    object._text = pointText;//;//标记显示内容
                    object._effectPosition = _intersects.point;//标记位置
                    _intersects._face = [ _intersects.face.a, _intersects.face.b, _intersects.face.c ];
                    object._intersects = _intersects;
                    if (_this.isAnimate) {
                        initSkinnedPosition(object._intersects);
                        object._barycoord = creatBarycoord(_intersects);//在初始化皮肤位置之后
                    }
                    return object;
                }

                //创建空的标记文本和背景，这里可以改成其他对象类型和样式
                function creatHotPostTextEmpty (_rayPoint) {
                    let element = document.createElement('div');
                    element.textContent = 'TIPS......';
                    element.style.width = '50px';
                    element.style.height = '50px';
                    element.style.opacity = (100 < 5) ? 0.5 : 1;
                    element.style.background = new THREE.Color(Math.random() * 0xffffff).getStyle();
                    let _text = new THREE.CSS3DObject(element);
                    _text.position.x = _rayPoint.x;
                    _text.position.y = _rayPoint.y;
                    _text.position.z = _rayPoint.z;
                    _text.rotation.x = camera.rotation.x;
                    _text.rotation.y = camera.rotation.y;
                    _text.rotation.z = camera.rotation.z;
                    _text.scale.x = 0.5;
                    _text.scale.y = 0.5;
                    return _text;
                }

                //更新CPU皮肤位置数据
                function _cpuSkinningVertex (in_skinnedMesh, in_face, in_barycoord, in_effectPosition) {
                    let _Vector4_1 = new THREE.Vector4(0, 0, 0, 1),
                        _Vector4_2 = new THREE.Vector4(0, 0, 0, 1),
                        _Vector4_3 = new THREE.Vector4(0, 0, 0, 1),
                        _Vector4_4 = new THREE.Vector4(0, 0, 0, 1),
                        _Vector4_5 = new THREE.Vector4(0, 0, 0, 1),
                        _Vector4_6 = new THREE.Vector4(0, 0, 0, 0),
                        _Vector4_7 = new THREE.Vector4(0, 0, 0, 0),
                        _vector4_array_1 = [], //骨骼矩阵数组
                        _vector4_array_2 = [];//三角位置临时变量

                    //初始化数组
                    for (let l = 0; l < 3; ++l) {
                        _vector4_array_2.push(new THREE.Vector4(0, 0, 0, 0));
                    }

                    //临时变量
                    let _attributes = in_skinnedMesh.geometry.attributes,     //SkinnedMesh几何缓存的属性
                        _bones = in_skinnedMesh.skeleton.bones,          //SkinnedMesh骨架的骨骼
                        _boneInverses = in_skinnedMesh.skeleton.boneInverses;   //SkinnedMesh骨架的反向骨骼
                    //处理实时的骨骼信息
                    for (let m = 0; m < _bones.length; ++m) {
                        _vector4_array_1.push(new THREE.Matrix4());//初始化骨骼矩阵数组
                        //世界坐标*反向骨骼
                        _vector4_array_1[ m ].multiplyMatrices(_bones[ m ].matrixWorld, _boneInverses[ m ]);//Matrix4.第一个矩阵*第二个矩阵
                    }

                    //处理SkinnedMesh的BufferGeometry数据
                    let _position = _attributes.position,      //位置
                        _skinWeight = _attributes.skinWeight,  //权重
                        _skinIndex = _attributes.skinIndex,     //索引
                        _position_array = _position.array,
                        _position_itemSize = _position.itemSize,     //position-BufferAttribute的关联值数量
                        _skinWeight_array = _skinWeight.array,
                        _skinWeight_itemSize = _skinWeight.itemSize, //skinWeight-BufferAttribute的关联值数量
                        _skinIndex_array = _skinIndex.array,
                        _skinIndex_itemSize = _skinIndex.itemSize;  //skinIndex-BufferAttribute的关联值数量
                    if (_position < 3 || _position > 4 || _skinWeight_itemSize != 4 || _skinIndex_itemSize != 4) {
                    } else {
                        let S = function (_vector, _point, _rotation) {
                            let _x = _point.x, _y = _point.y, _z = _point.z, _w = _point.w,
                                matrix_E = _vector.elements;//Matrix4矩阵元素
                            return _point.x = (matrix_E[ 0 ] * _x + matrix_E[ 4 ] * _y + matrix_E[ 8 ] * _z + matrix_E[ 12 ] * _w) * _rotation,
                                _point.y = (matrix_E[ 1 ] * _x + matrix_E[ 5 ] * _y + matrix_E[ 9 ] * _z + matrix_E[ 13 ] * _w) * _rotation,
                                _point.z = (matrix_E[ 2 ] * _x + matrix_E[ 6 ] * _y + matrix_E[ 10 ] * _z + matrix_E[ 14 ] * _w) * _rotation,
                                _point.w = (matrix_E[ 3 ] * _x + matrix_E[ 7 ] * _y + matrix_E[ 11 ] * _z + matrix_E[ 15 ] * _w) * _rotation,
                                _point;
                        };
                        //3次循环，填入更新后的位置
                        for (let j = 0; j < in_face.length; ++j) {
                            let w = in_face[ j ] * _skinWeight_itemSize,
                                P = in_face[ j ] * _position_itemSize;

                            _Vector4_1.x = _position_array[ P + 0 ], //3
                                _Vector4_1.y = _position_array[ P + 1 ], //4
                                _Vector4_1.z = _position_array[ P + 2 ], //5
                                _Vector4_1.w = 1,
                                _Vector4_2.x = _position_array[ P + 0 ], //3
                                _Vector4_2.y = _position_array[ P + 1 ], //4
                                _Vector4_2.z = _position_array[ P + 2 ], //5
                                _Vector4_2.w = 1,
                                _Vector4_3.x = _position_array[ P + 0 ], //3
                                _Vector4_3.y = _position_array[ P + 1 ], //4
                                _Vector4_3.z = _position_array[ P + 2 ], //5
                                _Vector4_3.w = 1,
                                _Vector4_4.x = _position_array[ P + 0 ], //3
                                _Vector4_4.y = _position_array[ P + 1 ], //4
                                _Vector4_4.z = _position_array[ P + 2 ], //5
                                _Vector4_4.w = 1,

                                _Vector4_6.x = _skinWeight_array[ w + 0 ], //4
                                _Vector4_6.y = _skinWeight_array[ w + 1 ], //5
                                _Vector4_6.z = _skinWeight_array[ w + 2 ], //6
                                _Vector4_6.w = _skinWeight_array[ w + 3 ], //7

                                _Vector4_7.x = _skinIndex_array[ w + 0 ], //4
                                _Vector4_7.y = _skinIndex_array[ w + 1 ], //5
                                _Vector4_7.z = _skinIndex_array[ w + 2 ], //6
                                _Vector4_7.w = _skinIndex_array[ w + 3 ], //7

                                S(_vector4_array_1[ _Vector4_7.x ], _Vector4_1, _Vector4_6.x),
                                S(_vector4_array_1[ _Vector4_7.y ], _Vector4_2, _Vector4_6.y),
                                S(_vector4_array_1[ _Vector4_7.z ], _Vector4_3, _Vector4_6.z),
                                S(_vector4_array_1[ _Vector4_7.w ], _Vector4_4, _Vector4_6.w),

                                _Vector4_5.x = _Vector4_1.x + _Vector4_2.x + _Vector4_3.x + _Vector4_4.x,
                                _Vector4_5.y = _Vector4_1.y + _Vector4_2.y + _Vector4_3.y + _Vector4_4.y,
                                _Vector4_5.z = _Vector4_1.z + _Vector4_2.z + _Vector4_3.z + _Vector4_4.z,
                                _Vector4_5.w = 1;
                            _vector4_array_2[ j ].copy(_Vector4_5);
                        }

                        //设置数据
                        in_effectPosition.set(0, 0, 0);
                        in_effectPosition.addScaledVector(_vector4_array_2[ 0 ], in_barycoord.x);
                        in_effectPosition.addScaledVector(_vector4_array_2[ 1 ], in_barycoord.y);
                        in_effectPosition.addScaledVector(_vector4_array_2[ 2 ], in_barycoord.z);
                    }

                }

                //获得重心
                function creatBarycoord (_intersects) {
                    let _object = _intersects.object;
                    let _face = _intersects.face;
                    let _face2 = new THREE.Vector3(0, 0, 0);
                    let _x_Value = 1;
                    let _y_Value = 1;
                    let _z_Value = 1;
                    // //处理坐标为负的情况
                    if (_object.bindMatrix.elements[ 0 ] == -1) {
                        _x_Value = -1;
                    }
                    if (_object.bindMatrix.elements[ 6 ] == -1) {
                        _y_Value = -1;
                    }
                    if (_object.bindMatrix.elements[ 9 ] == -1) {
                        _z_Value = -1;
                    }

                    let _vertexEC = _object.__skinnedPosition.__vertexElementCount, //实时的skinned位置和三角形数量？
                        l = _face.a * _vertexEC + 0,
                        _p1 = new THREE.Vector3(
                            _object.__skinnedPosition[ l + 1 ] * _y_Value,
                            _object.__skinnedPosition[ l + 2 ] * _z_Value,
                            _object.__skinnedPosition[ l ] * _x_Value),
                        u = _face.b * _vertexEC + 0,
                        _p2 = new THREE.Vector3(
                            _object.__skinnedPosition[ u + 1 ] * _y_Value,
                            _object.__skinnedPosition[ u + 2 ] * _z_Value,
                            _object.__skinnedPosition[ u ] * _x_Value),
                        p = _face.c * _vertexEC + 0,
                        _p3 = new THREE.Vector3(
                            _object.__skinnedPosition[ p + 1 ] * _y_Value,
                            _object.__skinnedPosition[ p + 2 ] * _z_Value,
                            _object.__skinnedPosition[ p ] * _x_Value);
                    // return THREE.Triangle.getBarycoord(_intersects.point, _p1, _p2, _p3);
                    let old_point;
                    let new_point = THREE.Triangle.getBarycoord(_intersects.point, _p1, _p2, _p3, old_point);
                    return new_point;
                }

                //初始化皮肤位置
                function initSkinnedPosition (_intersects) {
                    //处理一个暂时不知道什么用的三角形
                    //同时用三角面的3个值(a,b,c)生成3个点
                    _intersects.object.__skinnedPosition || (_intersects.object.__skinnedPosition = new Float32Array(_intersects.object.geometry.attributes.position.array.length),
                        _intersects.object.__skinnedPosition.__vertexElementCount = _intersects.object.geometry.attributes.position.itemSize);
                    let _attributes = _intersects.object.geometry.attributes;
                    let _bones = _intersects.object.skeleton ? _intersects.object.skeleton.bones : [];
                    let _boneInverses = _intersects.object.skeleton ? _intersects.object.skeleton.boneInverses : [];
                    let _boneArray = [];
                    for (let a = 0; a < _bones.length; a++) {
                        _boneArray.push(new THREE.Matrix4());
                        _boneArray[ a ].multiplyMatrices(_bones[ a ].matrixWorld, _boneInverses[ a ]);
                    }

                    let s = _attributes.position,
                        h = _attributes.skinWeight,
                        l = _attributes.skinIndex,
                        c = s.array,
                        u = s.itemSize,
                        d = h.array,
                        p = h.itemSize,
                        E = l.array,
                        f = l.itemSize;
                    if (s < 3 || s > 4 || p != 4 || f != 4) {
                        console.log("wrong position data format!");
                    }
                    let m = new THREE.Vector4(0, 0, 0, 1),
                        g = new THREE.Vector4(0, 0, 0, 1),
                        T = new THREE.Vector4(0, 0, 0, 1),
                        _ = new THREE.Vector4(0, 0, 0, 1),
                        R = new THREE.Vector4(0, 0, 0, 1),
                        v = new THREE.Vector4(0, 0, 0, 0),
                        y = new THREE.Vector4(0, 0, 0, 0),
                        H = function (e, t, r) {
                            let i = t.x,
                                n = t.y,
                                a = t.z,
                                o = t.w,
                                s = e.elements;
                            return t.x = (s[ 0 ] * i + s[ 4 ] * n + s[ 8 ] * a + s[ 12 ] * o) * r,
                                t.y = (s[ 1 ] * i + s[ 5 ] * n + s[ 9 ] * a + s[ 13 ] * o) * r,
                                t.z = (s[ 2 ] * i + s[ 6 ] * n + s[ 10 ] * a + s[ 14 ] * o) * r,
                                t.w = (s[ 3 ] * i + s[ 7 ] * n + s[ 11 ] * a + s[ 15 ] * o) * r,
                                t;
                        };
                    (new THREE.Matrix4()).getInverse(_intersects.object.matrixWorld);
                    for (let x = 0, b = 0; x < c.length; x += u, b += f) {
                        m.x = c[ x + 0 ],
                            m.y = c[ x + 1 ],
                            m.z = c[ x + 2 ],
                            m.w = 1,
                            g.x = c[ x + 0 ],
                            g.y = c[ x + 1 ],
                            g.z = c[ x + 2 ],
                            g.w = 1,
                            T.x = c[ x + 0 ],
                            T.y = c[ x + 1 ],
                            T.z = c[ x + 2 ],
                            T.w = 1,
                            _.x = c[ x + 0 ],
                            _.y = c[ x + 1 ],
                            _.z = c[ x + 2 ],
                            _.w = 1,
                            v.x = d[ b + 0 ],
                            v.y = d[ b + 1 ],
                            v.z = d[ b + 2 ],
                            v.w = d[ b + 3 ],
                            y.x = E[ b + 0 ],
                            y.y = E[ b + 1 ],
                            y.z = E[ b + 2 ],
                            y.w = E[ b + 3 ],
                            H(_boneArray[ y.x ], m, v.x),
                            H(_boneArray[ y.y ], g, v.y),
                            H(_boneArray[ y.z ], T, v.z),
                            H(_boneArray[ y.w ], _, v.w),
                            R.x = m.x + g.x + T.x + _.x,
                            R.y = m.y + g.y + T.y + _.y,
                            R.z = m.z + g.z + T.z + _.z,
                            R.w = 1,
                            _intersects.object.__skinnedPosition[ x + 0 ] = R.x;
                        _intersects.object.__skinnedPosition[ x + 1 ] = R.y;
                        _intersects.object.__skinnedPosition[ x + 2 ] = R.z;
                    }
                }

                //更新标记
                function updateHotpost () {
                    if (textMap && textMap.length > 0) {
                        textMap.forEach((item, index) => {
                            if (_this.showSpeedActive) {
                                _cpuSkinningVertex(item._intersects.object, item._intersects._face, item._barycoord, item._effectPosition);
                            }
                            if (scene && scene.children) {
                                let sceneMap = [];
                                sceneMap = sceneMap.concat(scene.children);
                                sceneMap = sceneMap.filter(obj => obj.name && obj.name.length > 0);
                                sceneMap.forEach((opt, j) => {
                                    if (j === index) {
                                        opt.position.x = item._effectPosition.x;
                                        opt.position.y = item._effectPosition.y;
                                        opt.position.z = item._effectPosition.z;
                                    }
                                });
                            }
                        });
                    }
                }

                //窗口重置
                function onWindowResize () {
                    let ele = document.getElementById('mainId');
                    if (ele) {
                        let offWidth = ele.offsetWidth;
                        let offHeight = ele.offsetHeight;
                        camera.aspect = offWidth / offHeight;
                        camera.updateProjectionMatrix();
                        renderer.setSize(offWidth, offHeight);
                        renderer2.setSize(offWidth, offHeight);
                    }
                }

                // 获取原始窗口大小
                let defaultMain = document.getElementById('mainId');
                screenWH = [ defaultMain.clientWidth, defaultMain.clientHeight ];

                $(document)
                    .off('click', '.screen-operate a.max-screen')
                    .on('click', '.screen-operate a.max-screen', function () {
                        defaultToMax();
                    });
                $(document)
                    .off('click', '.screen-operate a.default-full-screen')
                    .on('click', '.screen-operate a.default-full-screen', function () {
                        defaultToFull();
                    });
                $(document)
                    .off('click', '.screen-operate a.full-max-screen')
                    .on('click', '.screen-operate a.full-max-screen', function () {
                        fullToMax();
                    });
                $(document)
                    .off('click', '.screen-operate a.full-screen')
                    .on('click', '.screen-operate a.full-screen', function () {
                        maxToFull();
                    });
                $(document)
                    .off('click', '.screen-operate a.default-screen')
                    .on('click', '.screen-operate a.default-screen', function () {
                        toDefault();
                    });

                // Change Main Size
                function changeMainSize () {
                    let mainBox = document.getElementById('mainId');
                    let winWidth = window.innerWidth;
                    let winHeight = window.innerHeight;
                    mainBox.style.width = winWidth + 'px';
                    mainBox.style.height = winHeight + 'px';
                    mainBox.style.position = 'fixed';
                    mainBox.style.top = 0;
                    mainBox.style.left = 0;
                    mainBox.style.zIndex = 999;
                    camera.aspect = winWidth / winHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(winWidth, winHeight);
                    renderer2.setSize(winWidth, winHeight);
                }

                // Default Size
                function toDefault () {
                    exitFullScreenSize();
                    let mainBox = document.getElementById('mainId');
                    mainBox.style.width = screenWH[ 0 ] + 'px';
                    mainBox.style.height = screenWH[ 1 ] + 'px';
                    mainBox.style.position = 'relative';
                    mainBox.style.top = 0;
                    mainBox.style.left = 0;
                    mainBox.style.zIndex = 'auto';
                    camera.aspect = screenWH[ 0 ] / screenWH[ 1 ];
                    camera.updateProjectionMatrix();
                    renderer.setSize(screenWH[ 0 ], screenWH[ 1 ]);
                    renderer2.setSize(screenWH[ 0 ], screenWH[ 1 ]);
                    defaultSize();
                }

                //进入全屏
                function enterFullScreenSize () {
                    let docEle = document.documentElement;
                    //W3C
                    if (docEle.requestFullscreen) {
                        docEle.requestFullscreen();
                    }
                    //FireFox
                    else if (docEle.mozRequestFullScreen) {
                        docEle.mozRequestFullScreen();
                    }
                    //Chrome等
                    else if (docEle.webkitRequestFullScreen) {
                        docEle.webkitRequestFullScreen();
                    }
                    //IE11
                    else if (docEle.msRequestFullscreen) {
                        docEle.msRequestFullscreen();
                    }
                }

                //退出全屏
                function exitFullScreenSize () {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                }

                // 控制操作图标
                function defaultSize () {
                    $('.screen-operate a.full-screen')
                        .css('display', 'none');
                    $('.screen-operate a.default-full-screen')
                        .css('display', 'block');
                    $('.screen-operate a.max-screen')
                        .css('display', 'block');
                    $('.screen-operate a.full-max-screen')
                        .css('display', 'none');
                    $('.screen-operate a.default-screen')
                        .css('display', 'none');
                }

                function maxSize () {
                    $('.screen-operate a.full-screen')
                        .css('display', 'block');
                    $('.screen-operate a.default-full-screen')
                        .css('display', 'none');
                    $('.screen-operate a.max-screen')
                        .css('display', 'none');
                    $('.screen-operate a.full-max-screen')
                        .css('display', 'none');
                    $('.screen-operate a.default-screen')
                        .css('display', 'block');
                }

                function fullSize () {
                    $('.screen-operate a.full-screen')
                        .css('display', 'none');
                    $('.screen-operate a.default-full-screen')
                        .css('display', 'none');
                    $('.screen-operate a.max-screen')
                        .css('display', 'none');
                    $('.screen-operate a.full-max-screen')
                        .css('display', 'block');
                    $('.screen-operate a.default-screen')
                        .css('display', 'block');
                }

                // default —> max
                function defaultToMax () {
                    changeMainSize();
                    maxSize();
                }

                // default —> full
                function defaultToFull () {
                    enterFullScreenSize();
                    setTimeout(() => {
                        changeMainSize();
                    }, 500);
                    fullSize();
                }

                // max —> full
                function maxToFull () {
                    enterFullScreenSize();
                    setTimeout(() => {
                        changeMainSize();
                    }, 500);
                    fullSize();
                }

                // full —> max
                function fullToMax () {
                    exitFullScreenSize();
                    setTimeout(() => {
                        changeMainSize();
                    }, 500);
                    maxSize();
                }

                $(window)
                    .keydown(function (e) {
                        if (e.keyCode === 27) {
                            fullToMax();
                        }
                    });

                // 播放倍速
                $(document)
                    .off('click', '.ctrl-speed')
                    .on('click', '.ctrl-speed', function () {
                        $(this)
                            .find('dl dd')
                            .slideToggle();
                        $(this)
                            .find('li')
                            .off('click')
                            .on('click', function () {
                                speed = parseFloat($(this)
                                    .find('span')
                                    .text());
                                _this.animationProgressData.pervalue = beginPervalue * speed;
                                urlAnimate.time = totalTimes / speed;
                                // $('.play-speed').text(speed);
                                $(this)
                                    .addClass('selected-speed')
                                    .siblings('li')
                                    .removeClass('selected-speed');
                            });
                    });

                // Menu toggle
                let toggleCount = 0;
                $(document)
                    .off('click', '.left-menu-bar .toggle-menu')
                    .on('click', '.left-menu-bar .toggle-menu', function () {
                        toggleCount++;
                        let titleText;
                        if (toggleCount % 2 === 1) {
                            $(this)
                                .siblings('#menuBar')
                                .slideDown();
                            titleText = i18n.t('project.pro_hideActionBar');
                            $(this)
                                .children('i.toggle-icon')
                                .addClass('toggle-icon-up');
                        } else {
                            $(this)
                                .siblings('#menuBar')
                                .slideUp();
                            titleText = i18n.t('project.pro_showActionBar');
                            $(this)
                                .children('i.toggle-icon')
                                .removeClass('toggle-icon-up');
                        }
                        $(this)
                            .children('i.toggle-icon')
                            .attr('title', titleText);
                    });

                let attrCount = 0;
                $(document)
                    .off('click', '#info .toggle-menu')
                    .on('click', '#info .toggle-menu', function () {
                        attrCount++;
                        let titleText;
                        if (attrCount % 2 === 1) {
                            $(this)
                                .siblings('.attribute-list')
                                .slideDown();
                            titleText = i18n.t('project.pro_hideAttributeBar');
                            $(this)
                                .children('i.toggle-icon')
                                .addClass('toggle-icon-up');
                        } else {
                            $(this)
                                .siblings('.attribute-list')
                                .slideUp();
                            titleText = i18n.t('project.pro_showAttributeBar');
                            $(this)
                                .children('i.toggle-icon')
                                .removeClass('toggle-icon-up');
                        }
                        $(this)
                            .children('i.toggle-icon')
                            .attr('title', titleText);
                    });

                // 动画播放区间
                let appendPoint = 0, isPlayArea = false, playAreaStartTime;
                $(document)
                    .off('click', '.play-area .pick-play-area')
                    .on('click', '.play-area .pick-play-area', function () {
                        let isRangeBtn = false;
                        $('.range-start-container, .range-end-container')
                            .remove();
                        isPlayArea = false;
                        appendPoint++;
                        let pickStartEle = '<dia class="range-start-container"><a class="range-start" :title="i18n.t(\'project.pro_startPoint\')"><i class="range-triangle-icon"></i></a></dia>';
                        let pickEndEle = '<dia class="range-end-container"><a class="range-end" :title="i18n.t(\'project.pro_endPoint\')"><i class="range-triangle-icon"></i></a></dia>';
                        if (appendPoint % 2 === 1) {
                            isPlayArea = true;
                            $('#menu_progress')
                                .append(pickStartEle);
                            $('#menu_progress')
                                .append(pickEndEle);
                            let playEle = '<i class="play-icon iconfonts icon-bofang"></i>';
                            _this.animationProgressData.timeNow = _this.clock.elapsedTime;
                            _this.clock.stop();
                            if (urlObject.animations[ 0 ]) {
                                let bonesClip = urlObject.animations[ 0 ];
                                let action = urlObject.mixer.clipAction(bonesClip, null);
                                action.paused = !action.paused;
                                document.getElementById('progress_button').innerHTML = playEle;
                            }
                        } else {
                            isPlayArea = false;
                            urlAnimate.time = totalTimes;
                            $('.range-start-container, .range-end-container')
                                .remove();
                        }

                        // 选择播放范围
                        let rangeStartContainer = $('.range-start-container')[ 0 ];
                        let rangeEndContainer = $('.range-end-container')[ 0 ];
                        let playStartEle = $('.range-start')[ 0 ];
                        let playEndEle = $('.range-end')[ 0 ];

                        // 监听区间开始点
                        if (rangeStartContainer) {
                            rangeStartContainer.addEventListener('mousedown', function (e) {
                                isRangeBtn = false;
                                if (e.target.className === 'range-start') {
                                    e.target.parentElement.style.zIndex = 99;
                                }
                                isRangeBtn = true;
                            }, false);
                            rangeStartContainer.addEventListener('mousemove', function (e) {
                                let mainOffsetLeft = document.getElementById('mainId').getBoundingClientRect().left;
                                let getLeft = e.clientX - mainOffsetLeft;
                                let playEndLeft = $('.range-end')[ 0 ].offsetLeft;
                                if (isRangeBtn) {
                                    if (getLeft >= playEndLeft) {
                                        playStartEle.style.left = playEndLeft;
                                    } else {
                                        playStartEle.style.left = getLeft + 'px';
                                    }
                                    _this.clock.elapsedTime = getLeft / _this.animationProgressData.pervalue;
                                    isPlayArea = true;
                                    playAreaStartTime = _this.clock.elapsedTime;
                                }

                            }, false);
                            rangeStartContainer.addEventListener('mouseup', function (e) {
                                if (e.target.className === 'range-start' || e.target.className === 'range-end') {
                                    e.target.parentElement.style.zIndex = 0;
                                }
                                isRangeBtn = false;
                            }, false);
                        }

                        // 监听区间结束点
                        if (rangeEndContainer) {
                            rangeEndContainer.addEventListener('mousedown', function (e) {
                                isRangeBtn = false;
                                if (e.target.className === 'range-end') {
                                    e.target.parentElement.style.zIndex = 99;
                                }
                                isRangeBtn = true;
                            }, false);
                            rangeEndContainer.addEventListener('mousemove', function (e) {
                                let mainOffsetLeft = document.getElementById('mainId').getBoundingClientRect().left;
                                let getLeft = e.clientX - mainOffsetLeft;
                                let playStartLeft = $('.range-start')[ 0 ].offsetLeft;
                                if (isRangeBtn) {
                                    if (getLeft <= playStartLeft) {
                                        playEndEle.style.left = playStartLeft;
                                    } else {
                                        playEndEle.style.left = getLeft - 5 + 'px';
                                    }
                                    urlAnimate.time = getLeft / (_this.animationProgressData.pervalue);
                                }
                            }, false);
                            rangeEndContainer.addEventListener('mouseup', function (e) {
                                if (e.target.className === 'range-start' || e.target.className === 'range-end') {
                                    e.target.parentElement.style.zIndex = 0;
                                }
                                isRangeBtn = false;
                            }, false);
                        }
                    });

                // 单次播放
                let count = 0;
                $(document)
                    .off('click', '.play-once')
                    .on('click', '.play-once', function () {
                        count++;
                        _this.isCirclePlay = !_this.isCirclePlay;
                        loop = count % 2 === 1 ? 'once' : 'infinity';
                        loop === 'once' ? $(this)
                            .attr('title', i18n.t('project.pro_Loop')) : $(this)
                            .attr('title', i18n.t('project.pro_singlePlay'));
                    });

                // 显示/隐藏骨骼
                $(document)
                    .off('click', '.show-hide-bones')
                    .on('click', '.show-hide-bones', function () {
                        if (skeletonShow) {
                            skeletonShow.visible = !skeletonShow.visible;
                            _this.bonesTitle = skeletonShow.visible ? i18n.t('project.pro_hideTheSkeleton') : i18n.t('project.pro_showBones');
                        }
                    });

                // 开启/关闭自动旋转
                $(document)
                    .off('click', '.open-close-auto-rotate')
                    .on('click', '.open-close-auto-rotate', function () {
                        // rotateBtn.addEventListener('click', function () {
                        controls.autoRotate = !controls.autoRotate;
                        // });
                    });

                // 显示/隐藏 XYZ 坐标轴
                $(document)
                    .off('click', '.show-hide-axis')
                    .on('click', '.show-hide-axis', function () {
                        let subSceneList = scene.children;
                        let axisVisible = subSceneList.filter(item => item.axisName === 'animateAxis');
                        axisVisible.forEach(opt => {
                            opt.visible = !opt.visible;
                            _this.xyzAxisTitle = opt.visible ? i18n.t('project.pro_hiddenAxis'): i18n.t('project.pro_showAxis');
                        });
                    });

                // 显示隐藏法线，高光等
                $(document)
                    .off('click', '.show-hide-map')
                    .on('click', '.show-hide-map', function () {
                        $('dd.render-option')
                            .slideToggle();
                        let textureImgList = _this.textureList;
                        let textureMap = textureImgList.map(item => ({
                            texture: loadTexture(item.file)
                        }));
                        if (textureMap && textureMap.length > 1) {
                            $('.normal-map')
                                .css('display', 'block');
                        }
                    });

                $(document)
                    .off('click', '.render-option li')
                    .on('click', '.render-option li', function () {
                        let clsName = $(this)
                            .attr('default-name');
                        $(this)
                            .addClass('show-current-render')
                            .siblings('li')
                            .removeClass('show-current-render');
                        let textureImgList = _this.textureList;
                        let textureMap = textureImgList.map(item => ({
                            texture: loadTexture(item.file)
                        }));
                        urlObject.traverse(child => {
                            if (child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) {
                                switch (clsName) {
                                    case 'normal-map':
                                        showNormalMap(child, textureMap[ 1 ].texture);
                                        break;
                                    case 'bump-map':
                                        showBumpMap(child, textureMap[ 1 ].texture);
                                        break;
                                    case 'wire-frame':
                                        showWireframe(child);
                                        break;
                                    case 'specular-light':
                                        showSpecularMap(child, textureMap);
                                        break;
                                    case 'all-models':
                                        showAllModels(child, textureMap);
                                        break;
                                }
                                child.material.needsUpdate = true;
                            }
                        });
                    });

                // 获取到坐标点和标注信息
                function getSignText (option, index) {
                    let pointEle = document.createElement('div');
                    pointEle.className = 'sign-container';
                    pointEle.innerHTML = '<div class="sign-point-num" id="Ts' + option.index + '">' + option.index + '</div>';
                    signNum = option.index;
                    let signPointObj = new THREE.CSS3DObject(pointEle);
                    signPointObj.position.x = option.pointPos.x;
                    signPointObj.position.y = option.pointPos.y;
                    signPointObj.position.z = option.pointPos.z;
                    signPointObj.rotation.x = option.rotationPos.x;
                    signPointObj.rotation.y = option.rotationPos.y;
                    signPointObj.rotation.z = option.rotationPos.z;
                    signPointObj.cameraPos = option.cameraPos;
                    signPointObj.name = 'sign' + option.index;
                    let scale = ndcCompareScreenScale(signPointObj.position);
                    signPointObj.scale.x = scale;
                    signPointObj.scale.y = scale;
                    if (signPointObj.name && signPointObj.name.length > 0) {
                        scene.add(signPointObj);
                    }
                    signTexts.push(signPointObj);
                    if (_this.isAnimate) {
                        addSigns(index, 'detail', option);
                    }
                }

                // 计算时间
                function canculationPlayTime () {
                    let currentTimeSeconds = document.querySelector('.current-progress-time');
                    let totalTime = parseInt(urlAnimate.time) || 0;
                    let elapsedTime = parseInt(clock.elapsedTime * speed) || 0;
                    let currentNum = '';
                    if (totalTime) {
                        if (totalTime < 60) {
                            elapsedTime = (Array(2)
                                .join("0") + elapsedTime).slice(-2);
                            currentNum += '00:' + elapsedTime;
                        } else if (totalTime >= 60 && totalTime < 3600) {
                            let minute = parseInt(elapsedTime / 60);
                            let seconds = elapsedTime % 60;
                            minute = (Array(2)
                                .join("0") + minute).slice(-2);
                            seconds = (Array(2)
                                .join("0") + seconds).slice(-2);
                            currentNum += minute + ':' + seconds;
                        }
                    } else {
                        currentNum += '00:00';
                    }
                    if (currentTimeSeconds) {
                        currentTimeSeconds.innerText = currentNum;
                    }
                }

                // 循环播放
                function infinityPlay (playType) {
                    renderSignData(_this.signedDataList);
                    if (clock.elapsedTime < urlAnimate.time) {
                        if (_this.animationProgressData) {
                            //按帧播放版本
                            // _this.animationProgressData.value = clock.elapsedTime/urlAnimate.perframe;
                            //按时间模仿版本
                            _this.animationProgressData.value = clock.elapsedTime;
                            _this.animationProgressData.button.style.left = _this.animationProgressData.value * (_this.animationProgressData.pervalue) + 'px';
                            canculationPlayTime();
                        }
                    } else if (playType === 'infinity') {
                        if (isPlayArea) {
                            clock.elapsedTime = playAreaStartTime;
                        } else {
                            clock.elapsedTime = 0;
                        }
                    } else if (playType === 'once' && (clock.elapsedTime) >= urlAnimate.time) {
                        let bonesClip = urlObject.animations[ 0 ];
                        let action = urlObject.mixer.clipAction(bonesClip, null);
                        action.paused = !action.paused;
                        let playEle = '<i class="play-icon iconfonts icon-bofang"></i>';
                        document.getElementById('progress_button').innerHTML = playEle;
                        canculationPlayTime();
                        clock.stop();
                        if (isPlayArea) {
                            clock.elapsedTime = playAreaStartTime;
                        } else {
                            clock.elapsedTime = 0;
                        }
                        _this.animationProgressData.button.style.left = 0;
                    }
                }

                //动画
                function animate () {
                    _this.stopAnimate = requestAnimationFrame(animate);
                    if (mixers.length > 0) {
                        for (let i = 0; i < mixers.length; i++) {
                            mixers[ i ].update(speed * clock.getDelta());
                        }
                        infinityPlay(loop);
                    }

                    // updateHotpost();

                    if (controls) {
                        controls.update();
                    }
                    // updateCrossFadeControls();
                    renderer.render(scene, camera);
                    renderer2.render(scene, camera);
                }

                function updateCrossFadeControls () {
                    // crossFadeControls.forEach(function (control) {
                    // control.setDisabled();
                    // });
                }
            },
            //获得标记
            getSign () {
                let fileList = this.taskInfos.file;
                let mainFile = fileList.filter(file => file.is_main === '1');
                this.signData = mainFile[ 0 ];
                this.onload();
            },
            //getUserInfo
            userInfos () {
                let Infos = JSON.parse(Cookies.get('company'));
                switch (Infos.post_id) {
                    case '1':
                        this.userPost.postName = i18n.t('project.pro_manager');
                        this.userPost.postId = '1';
                        break;
                    case '2':
                        this.userPost.postName = i18n.t('project.pro_groupLeader');
                        this.userPost.postId = '2';
                        break;
                    case '3':
                        this.userPost.postName = i18n.t('lang.lang_member');
                        this.userPost.postId = '3';
                        break;
                }
            },

            /**
             * 清除模型，模型中有 group 和 scene,需要进行判断
             * @param scene
             * @returns
             */
            clearScene () {
                // 取消动画渲染
                window.cancelAnimationFrame(this.stopAnimate);
                this.stopAnimate = null;
                // 从scene中删除模型并释放内存
                THREE.Cache.clear();
                if (this.renderer) {
                    this.renderer.dispose();
                }
                // this.renderer2.dispose();
                let myObjects = this.obj ? this.obj.children : [];
                let scene = this.scene;
                if (myObjects.length > 0) {
                    for (let i = 0; i < myObjects.length; i++) {
                        let currObj = myObjects[ i ];

                        // 判断类型
                        if (currObj instanceof THREE.Scene) {
                            let children = currObj.children;
                            for (let j = 0; j < children.length; j++) {
                                this.deleteGroup(children[ j ]);
                            }
                        } else {
                            this.deleteGroup(currObj);
                        }
                        scene.remove(currObj);
                    }
                }
            },
            // 删除group，释放内存
            deleteGroup (group) {
                if (!group) {
                    return;
                }
                // 删除掉所有的模型组内的mesh
                group.traverse(function (item) {
                    if (item instanceof THREE.Mesh) {
                        item.geometry.dispose(); // 删除几何体
                        item.material.dispose(); // 删除材质
                    }
                });
            },
            removeEvent () {
                window.removeEventListener('resize', this.windowResize);
            }
            // 获取权限
            // getEditModelPermission () {
            //     this.isSignPermission = this.$refs.feedback ? this.$refs.feedback.isEditShow() : false;
            //     return this.isSignPermission;
            // }
        },
        destroyed () {
            this.clearScene();
            this.removeEvent();
        },
        components: {
            feedbackInfo,
            commonLoading,
            resourceLoading
        }
    };
</script>
<style lang="less">
    @import "./threeFile/style/sign.css";
    @import "./threeFile/style/feek.less";
    @import './imgEditorTwo/style/imgEditor.less';

    div#mainId {
        height: 100%;
        position: relative;
        background-color: #ebeff2;
        margin: 0;
        overflow: hidden;
        .ivu-select-selection {
            border: 1px solid #dddee1 !important;
        }
    }

    .sign-content-box {
        display: none;
        position: absolute;
        width: 280px;
        min-height: 42px;
        max-height: 142px;
        padding: 10px;
        background: #fff;
        overflow-y: auto;
        z-index: 9999;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        .edit-sign-content {
            width: 100%;
            height: 80px;
            border: 1px solid #e0e0e0;
            padding: 5px;
            resize: none;
            color: #333;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
            -webkit-transition: all 0.3s;
            -moz-transition: all 0.3s;
            -ms-transition: all 0.3s;
            -o-transition: all 0.3s;
            transition: all 0.3s;
            &:focus {
                border: 1px solid @base;
            }
        }
        .show-sign-content {
            width: 100%;
            height: 100%;
            text-align: justify;
            -ms-word-wrap: break-word;
            word-wrap: break-word;
            word-break: break-word;
            line-height: 22px;
        }
        .btn-group {
            width: 100%;
            padding: 5px 0 0;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            > a {
                display: block;
                width: 75px;
                height: 32px;
                line-height: 32px;
                text-align: center;
                margin-left: 10px;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                border-radius: 3px;
                -webkit-transition: all 0.3s;
                -moz-transition: all 0.3s;
                -ms-transition: all 0.3s;
                -o-transition: all 0.3s;
                transition: all 0.3s;
            }
            .confirm-sign-btn {
                background: @base;
                color: #fff;
                &:hover {
                    background: rgba(60, 210, 180, 0.9);
                }
            }
            .cancel-sign-btn {
                background: none;
                color: #777;
                border: 1px solid #fff;
                &:hover {
                    border: 1px solid rgba(60, 210, 180, 0.3);
                }
            }
        }
    }

    .screen-operate {
        position: relative;
        float: right;
        top: 8px;
        margin-right: 5px;
        z-index: 9999;
        > a {
            display: block;
            width: 22px;
            height: 22px;
            float: right;
            text-align: center;
            margin-left: 8px;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
            padding: 2px 0 0 0;
            &.max-screen, &.default-full-screen {
                display: block;
            }
            &.exit-full-screen, &.default-screen, &.full-screen, &.full-max-screen {
                display: none;
            }
            > i {
                font-size: 13px;
                color: #fff;
                &.ivu-icon-ios-browsers-outline {
                    font-size: 19px;
                    margin-top: 0;
                }
                /*&:hover {*/
                /*cursor: pointer;*/
                /*-webkit-transform: rotate(360deg);*/
                /*-moz-transform: rotate(360deg);*/
                /*-ms-transform: rotate(360deg);*/
                /*-o-transform: rotate(360deg);*/
                /*transform: rotate(360deg);*/
                /*-webkit-transition: all 0.3s;*/
                /*-moz-transition: all 0.3s;*/
                /*-ms-transition: all 0.3s;*/
                /*-o-transition: all 0.3s;*/
                /*transition: all 0.3s;*/
                /*}*/
            }
            &:hover {
                background: @base;
            }
        }

    }

    #info {
        position: absolute;
        top: 0;
        right: 0;
        width: 200px;
        height: auto;
        background: rgba(0, 0, 0, 0.59);
        text-align: left;
        padding: 0;
        margin: 4px 4px;
        z-index: 3;
        > .attribute-list {
            display: none;
        }
        > .toggle-menu {
            position: absolute;
            width: 100%;
            height: 5px;
            left: 0;
            bottom: -5px;
            background: #00000060;
            /*border-top: 1px solid #fff;*/
            /*border-bottom: 1px solid #fff;*/
            > i.toggle-icon {
                position: absolute;
                top: 5px;
                left: 84px;
                width: 0;
                height: 0;
                border-width: 8px 16px 0 16px;
                border-style: solid;
                border-color: #00000060 transparent transparent;
                &.toggle-icon-up {
                    top: -3px;
                    border-width: 0 16px 8px 16px;
                    border-color: transparent transparent #00000099;
                }
            }
        }
    }

    #info li {
        color: #ffffff;
        font-size: 12px;
        margin: 4px 4px;
    }

    #three_progress {
        /* z-index: 101; */
        /* background: rgba(138, 138, 138, 0); */
        background-color: #ececec;
        /* border: 1px solid #3bceb6; */
        /* cursor: pointer; */
        width: 100%;
        height: 3px;
        position: absolute;
        top: 0;
        /*margin-left:50px;*/
        /*margin: 15px 50px 0;*/
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
    }

    #three_progress:before {
        width: 100%;
        height: 150%;
        display: block;
        border-top: 1px dashed #33ffff;
    }

    .total-time {
        /*float: right;*/
        position: absolute;
        display: block;
        width: 48px;
        /*margin-top: -13px;*/
        color: #fff;
        text-align: left;
        left: 77px;
        top: 9px;
        > .time-line {
            line-height: 16px;
            float: left;
            margin-right: 4px;
            font-size: 12px;
        }
    }

    .time-line-dot {
        display: block;
        position: absolute;
        width: 18px;
        height: 18px;
        top: 6px;
        border-radius: 80% 0 80% 80%;
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        -o-transform: rotate(-45deg);
        transform: rotate(-45deg);
        background: @base;
        text-align: center;
        cursor: pointer;
        z-index: 10;
        .sign-number {
            position: absolute;
            display: block;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            color: #fff;
            font-size: 12px;
            -webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            -o-transform: rotate(45deg);
            transform: rotate(45deg);
        }
    }

    #progress_drag_button {
        z-index: 101;
        position: absolute;
        left: 0;
        width: 6px;
        height: 6px;
        background: #3bceb6;
        border-radius: 50%;
        margin: -1px 0;
        padding: 0;
        cursor: pointer;
    }

    #progress_drag_button:hover {
        width: 8px;
        height: 8px;
        margin: -3px -1px;
        transition: all 0.2s;
        -webkit-box-shadow: 0 0 1px 1px #3bceb6;
        -moz-box-shadow: 0 0 1px 1px #3bceb6;
        box-shadow: 0 0 1px 1px #3bceb6;
    }

    .current-progress-time {
        position: absolute;
        /*margin-top: -15px;*/
        /*margin-left: -8px;*/
        color: #fff;
        font-size: 12px;
        left: 42px;
        top: 9px;
        color: #fff;
    }

    #progress_button {
        outline: none;
        color: #fdfdfd;
        font-size: 12px;
        background: rgba(255, 255, 255, 0);
        border: none;
        margin: 10px 15px 10px 10px;
        cursor: pointer;
        width: 18px;
        height: 18px;
        min-width: 18px;
        max-width: 18px;
        padding: 0;
        position: relative;
        /*left:0;*/
        float: left;
        /*border: none;*/
        -webkit-border-radius: 20px;
        -moz-border-radius: 20px;
        border-radius: 20px;
        z-index: 99;
    }

    .play-icon {
        display: block;
        margin: 0 2px;
    }

    .pause-icon {
        display: block;
        margin: -1px 0;
    }

    #menu_progress {
        position: absolute;
        width: 100%;
        /*top: 642px;*/
        bottom: 0;
        height: 36px;
        text-align: left;
        padding: 0;
        margin: 0;
        z-index: 9;
        -webkit-box-shadow: 0 -10px 38px 10px #888 inset;
        -moz-box-shadow: 0 -10px 38px 10px #888 inset;
        box-shadow: 0 -10px 38px 10px #888 inset;
        .color-pick-box {
            position: absolute;
            top: 9px;
            right: 180px;
            .pick-color {
                color: #fff;
                //<!--&:hover {-->
                //<!--color: @base;-->
                //<!--}-->
            }
            .color-showing {
                position: absolute;
                bottom: 35px;
                width: 88px;
                height: 62px;
                background: #00000069;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                border-radius: 3px;
                padding: 5px;
                left: -30px;
                z-index: 9;
                text-align: center;
                > i.triangle-color-icon {
                    position: absolute;
                    bottom: -9px;
                    right: 32px;
                    width: 0;
                    height: 0;
                    border-width: 9px 8px 0 8px;
                    border-style: solid;
                    border-color: #00000069 transparent transparent;
                }
                > span {
                    display: block;
                    width: 100%;
                    height: 28px;
                    background: #fff;
                    color: #777;
                    text-align: center;
                }
                > b {
                    color: #fff;
                    line-height: 30px;
                    font-weight: normal;
                }
            }
        }
        .ctrl-speed {
            position: relative;
            float: right;
            top: 8px;
            width: 23px;
            height: 20px;
            z-index: 9;
            margin-left: 8px;
            > dl {
                position: relative;
                dt {
                    color: #fff;
                    cursor: pointer;
                    line-height: 20px;
                    text-align: center;
                    -webkit-border-radius: 3px;
                    -moz-border-radius: 3px;
                    border-radius: 3px;
                    padding: 2px 2px 0;
                    > i {
                        font-size: 17px;
                    }
                    > .play-speed {
                        margin-left: 2px;
                    }
                    &:hover {
                        background: @base;
                    }
                }
                dd {
                    position: absolute;
                    display: none;
                    bottom: 37.5px;
                    z-index: 9;
                    width: 118px;
                    margin-left: -48px;
                    height: 58px;
                    padding: 5px;
                    background: #00000069;
                    color: #fff;
                    -webkit-border-radius: 3px;
                    -moz-border-radius: 3px;
                    border-radius: 3px;
                    > i.triangle-down-icon {
                        position: absolute;
                        bottom: -9px;
                        right: 50px;
                        width: 0;
                        height: 0;
                        border-width: 9px 8px 0 8px;
                        border-style: solid;
                        border-color: #00000069 transparent transparent;
                    }
                    > ul {
                        display: flex;
                        justify-content: space-around;
                        flex-wrap: wrap;
                        li {
                            float: left;
                            width: 48%;
                            margin: 2px 1%;
                            text-align: center;
                            line-height: 20px;
                            &:hover, &.selected-speed {
                                cursor: pointer;
                                color: #fff;
                                background: @base;
                                -webkit-border-radius: 3px;
                                -moz-border-radius: 3px;
                                border-radius: 3px;
                            }
                        }
                    }

                }
            }
            .triangle-icon {
                position: absolute;
                top: 7px;
                right: 5px;
                width: 0;
                height: 0;
                border-width: 0 5px 7px 5px;
                border-style: solid;
                border-color: transparent transparent #fff;
            }
        }

        .play-area {
            position: relative;
            /*right: 105px;*/
            top: 8px;
            text-align: center;
            float: right;
            > a {
                display: block;
                width: 23px;
                float: left;
                color: #fff;
                padding: 2px 3px 1px;
                margin-left: 8px;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                border-radius: 3px;
                &:hover {
                    background: @base;
                }
                > i {
                    color: #fff;
                    font-size: 16px;
                }
                &.play-once {
                    padding: 1px 0 0;
                    > i.icon-inside-cycle {
                        display: block;
                        font-size: 21px;
                        margin-bottom: 1px;
                    }
                    > i.icon-onecycle {
                        display: block;
                        margin: 2px 2px 4px;
                    }
                }
                &.pick-play-area {
                    > i {
                        font-size: 18px;
                        /*padding-top: 2px;*/
                    }
                }
            }
        }
        .show-attributes {
            position: relative;
            top: 8px;
            float: right;
            text-align: center;
            > a {
                display: block;
                float: left;
                padding: 3px 2px 0;
                text-align: center;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                border-radius: 3px;
                margin-left: 8px;
                > i {
                    font-size: 18px;
                    color: #fff;
                }
                &:hover {
                    background: @base;
                }
            }
            .show-hide-map {
                position: relative;
                float: left;
                width: 23px;
                height: 23px;
                margin-left: 6px;
                > dl {
                    position: relative;
                    dt {
                        padding: 3px 3px 1px;
                        text-align: center;
                        -webkit-border-radius: 3px;
                        -moz-border-radius: 3px;
                        border-radius: 3px;
                        > i {
                            font-size: 17px;
                            color: #fff;
                        }
                        &:hover {
                            cursor: pointer;
                            background: @base;
                        }
                    }
                    dd.render-option {
                        position: absolute;
                        display: none;
                        bottom: 39.5px;
                        z-index: 9;
                        width: 128px;
                        margin-left: -53px;
                        /*min-height: 35px;*/
                        min-height: 34px;
                        padding: 5px;
                        background: #00000069;
                        color: #fff;
                        -webkit-border-radius: 3px;
                        -moz-border-radius: 3px;
                        border-radius: 3px;
                        > i.triangle-down-icon {
                            position: absolute;
                            bottom: -9px;
                            right: 56px;
                            width: 0;
                            height: 0;
                            border-width: 9px 8px 0 8px;
                            border-style: solid;
                            border-color: #00000069 transparent transparent;
                        }
                        > ul {
                            display: flex;
                            justify-content: flex-start;
                            flex-wrap: wrap;
                            li {
                                display: block;
                                float: left;
                                width: 48%;
                                margin: 2px 1%;
                                text-align: center;
                                line-height: 20px;
                                &:hover, &.show-current-render {
                                    cursor: pointer;
                                    color: #fff;
                                    background: @base;
                                    -webkit-border-radius: 3px;
                                    -moz-border-radius: 3px;
                                    border-radius: 3px;
                                }
                                &.wire-frame, &.all-models {
                                    display: block;
                                }
                            }
                        }
                    }
                }
            }
        }

        .range-start-container, .range-end-container {
            position: absolute;
            width: 100%;
            height: 36px;
            left: 0;
            top: -18px;
            > a {
                position: absolute;
                display: block;
                width: 12px;
                height: 15px;
                top: -5px;
                background: #ccc;
                -webkit-border-radius: 2px 2px 0 0;
                -moz-border-radius: 2px 2px 0 0;
                border-radius: 2px 2px 0 0;
                > i.range-triangle-icon {
                    position: absolute;
                    top: 15px;
                    left: 0;
                    width: 0;
                    height: 0;
                    border-style: solid;
                    border-color: #ccc transparent transparent;
                }
                &.range-start {
                    left: 0;
                    z-index: 999;
                    > i {
                        border-width: 12px 12px 0 0;
                    }
                }
                &.range-end {
                    right: 0;
                    z-index: 999;
                    > i {
                        border-width: 12px 0 0 12px;
                    }
                }
            }
        }

    }

    .left-menu-bar {
        position: absolute;
        top: 0;
        left: 0;
        width: 115px;
        height: auto;
        text-align: left;
        padding: 0 10px;
        margin: 4px 4px;
        z-index: 9;
        background: #00000080;
        > #menuBar {
            display: none;
            padding: 10px 0;
        }
        > .toggle-menu {
            position: absolute;
            width: 100%;
            height: 5px;
            left: 0;
            bottom: -5px;
            background: #00000060;
            /*border-top: 1px solid #fff;*/
            /*border-bottom: 1px solid #fff;*/
            > i.toggle-icon {
                position: absolute;
                top: 5px;
                left: 42px;
                width: 0;
                height: 0;
                border-width: 8px 16px 0 16px;
                border-style: solid;
                border-color: #00000060 transparent transparent;
                &.toggle-icon-up {
                    top: -3px;
                    border-width: 0 16px 8px 16px;
                    border-color: transparent transparent #00000099;
                }
            }
        }
    }

    .three_button, .axis-btn {
        color: #fdfdfd;
        font-size: 12px;
        background: rgba(255, 255, 255, 0);
        border: 1px solid @base;
        /* padding: 5px 10px; */
        cursor: pointer;
        width: 95px;
        min-width: 95px;
        height: 24px;
        line-height: 12px;
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
        border-radius: 2px;
        margin-bottom: 3px;
        &:hover {
            background-color: @base;
        }
    }

    /*.three_button:hover {*/
    /*background-color: #3bceb6;*/
    /*}*/

    /*.three_button:active {*/
    /*color: #000000;*/
    /*background-color: #3bceb6;*/
    /*}*/

    select {
        /* color: #bcbcbc; */
        /* background: rgba(255, 255, 255, 0); */
        /* border: 1px solid #3bceb6; */
        /* padding: 5px 10px; */
        /* cursor: pointer; */
        /* width: 100px; */
        /* height: 32px; */
        /* z-index: 100; */
    }

    .sign-container {
        .sign-point-num {
            width: 15px;
            height: 15px;
            display: block;
            /*background: rgba(60, 210, 180, 0.9);*/
            background: #f30;
            border-radius: 50%;
            text-align: center;
            font-size: 12px;
            line-height: 15px;
            color: #fff;
            /*border: 2px solid rgba(60, 210, 180, 1);*/
        }
        .signIndex {
            width: 15px;
            height: 15px;
            line-height: 15px;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
            background: #f30;
            /*-webkit-box-shadow: 0 0 2px 1px #f00;*/
            /*-moz-box-shadow: 0 0 2px 1px #f00;*/
            /*box-shadow: 0 0 2px 1px #f00;*/
            font-size: 12px;
            > .hintBox {
                display: none;
                left: 20px;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                border-radius: 3px;
                background: rgba(255, 255, 255, 0.9);
                padding: 5px;
                color: @black_2;
                font-size: 12px;
                -webkit-box-shadow: 0 0 1px 1px #ccc;
                -moz-box-shadow: 0 0 1px 1px #ccc;
                box-shadow: 0 0 1px 1px #ccc;
                word-break: break-all;
                -ms-word-wrap: break-word;
                word-wrap: break-word;
            }
            > .chooseBox {
                left: 120px;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                border-radius: 3px;
                li#deleteSign {
                    font-size: 15px;
                    line-height: 14px;
                    -webkit-border-radius: 3px;
                    -moz-border-radius: 3px;
                    border-radius: 3px;
                    background: #f60;
                    &:hover {
                        background-color: #f80;
                    }
                }
            }
        }
    }

    #base3D {
        position: relative;
        .error-extension {
            position: relative;
            height: 100%;
            text-align: center;
            line-height: 350px;
            font-size: 16px;
            font-weight: normal;
            color: #777;
        }
        .normal-render-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-wrap: nowrap;
            align-content: space-between;
            > .sub-container {
                width: 100%;
                height: 100%;
                border-right: 1px solid #ddd;
                text-align: center;
                > span {
                    display: block;
                    margin-top: 128px;
                    transform: rotate(90deg);
                    text-align: left;
                    font-size: 14px;
                    color: #fff;
                }
            }
        }
    }

    // 重写标记框
    .signcover {
        .inputSignBox {
            width: 250px;
            height: auto;
            background: #fff;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
            padding: 5px;
            -webkit-box-shadow: 0 0 5px 1px #CFCFCF;
            -moz-box-shadow: 0 0 5px 1px #CFCFCF;
            box-shadow: 0 0 5px 1px #CFCFCF;
            .trangle-sign-icon {
                position: absolute;
                top: -10px;
                left: 10px;
                width: 0;
                height: 0;
                border-width: 0 8px 10px 8px;
                border-style: solid;
                border-color: transparent transparent #e9e9e9;
            }
            .signbox {
                position: relative;
                border: 1px solid #eee;
                padding: 2px 5px;
                bottom: auto;
                height: 68px;
                margin-bottom: 5px;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                border-radius: 3px;
                &:hover, &:focus {
                    border: 1px solid @base;
                    -webkit-transition: all 0.3s;
                    -moz-transition: all 0.3s;
                    -ms-transition: all 0.3s;
                    -o-transition: all 0.3s;
                    transition: all 0.3s;
                }
            }
            .operate-btn-group {
                width: 100%;
                height: 29px;
                > a {
                    display: block;
                    float: right;
                    width: 60px;
                    height: 29px;
                    text-align: center;
                    line-height: 29px;
                    color: #fff;
                    font-size: 12px;
                    -webkit-border-radius: 3px;
                    -moz-border-radius: 3px;
                    border-radius: 3px;
                    margin-left: 10px;
                    &.outSignbox {
                        position: relative;
                        text-indent: 0;
                    }
                    &.confirm-sign {
                        position: relative;
                        background: @base;
                    }
                    &.cancel-btn {
                        background: #a7a7a7;
                    }
                }
            }
        }
    }

</style>

<!--<style>-->
<!--@import "./threeFile/style/sign.css";-->
<!--</style>-->
