<template>
    <div id="modelContainer" class="model-preview-container">
        <div class="model-option-bar" v-if="animationParams.showAnimateBar" @mousemove="enterMouseMove($event)" @mouseup="enterMouseUp()">
            <div class="play-progress" v-if="animationParams.showProgressBar" @mousedown.stop="enterMouseDown($event)">
                    <div class="played-progress" :style="{width: progressParams.played}">
                    <span class="played-point" :class="{'width-zero': progressParams.played === '0%'}" @mousedown.stop="enterMouseDown($event)"></span>
                    </div>
                </div>
                <div class="model-info" v-if="animationParams.showProgressBar">
                    <a class="play-pause-option" @click="playPauseAnimate(playStatus)">
                        <Icon type="play" v-if="playStatus==='pause'"></Icon>
                        <Icon type="pause" v-else></Icon>
                    </a>
                    <a class="display-time-info">
                        <label>{{animationParams.currentTime}}</label>
                        <span>/</span>
                        <label>{{animationParams.totalTime}}</label>
                    </a>
                </div>
                <div class="operate-option">
                    <ul>
                    <li class="enter-full-screen" :title="$t('project.pro_fullScreen')" @click="fullScreenOrNot()">
                        <Icon v-if="true" type="arrow-expand"></Icon>
                        <Icon v-else type="arrow-shrink"></Icon>
                    </li>
                    <li class="auto-rotate" :title="$t('project.pro_autorotation')" @click="autoRotate()">
                        <i class="iconfonts icon-rota"></i>
                    </li>
                    <li class="toggle-axis" @click="toggleAxis()" :title="modelRelationship.xyzAxisTitle">
                        <i class="iconfonts icon-xyz-asix"></i>
                    </li>
                    <li class="toggle-skeleton" v-if="modelRelationship.skeleton" @click="toggleSkeleton()" :title="modelRelationship.skeletonTitle">
                        <i class="iconfonts icon-showperson"></i>
                    </li>
                    <li class="toggle-once-infinity" v-if="animationParams.showProgressBar" @click="toggleAnimateInfinity()" :title="modelRelationship.onceTitle">
                        <i class="iconfonts icon-inside-cycle" v-if="modelRelationship.isOnce"></i>
                        <i class="iconfonts icon-onecycle" v-else></i>
                    </li>
                    <li class="toggle-animate-speed" v-if="animationParams.showChangeSpeed" :title="$t('project.pro_playTimesSpeed')" @click.stop="toggleAnimateSpeed()">
                        <i class="iconfonts icon-fast"></i>
                        <div class="speed-type" v-if="optionParams.showOrHide" @mouseleave="optionParams.showOrHide=false">
                            <span class="down-triangle-icon"></span>
                            <ul>
                                <li v-for="opt in animateSpeedTypes" :class="{'selected-speed': opt.selected}" @click.stop="changeSpeed(opt)"><span>{{opt.speed}}</span>{{$t('project.pro_DoubleSpeed')}}</li>
                            </ul>
                        </div>
                    </li>
                    </ul>
                </div>
            </div>
    </div>
</template>

<script>
    export default {
        name: 'model-preview',
        props: {},
        data () {
            return {
                playStatus: 'play',
                path: '',
                clock: null,
                animationParams: {
                    isAnimation: false,
                    totalTime: 0,
                    currentTime: 0,
                    modelSeconds: 0,
                    pauseTime: 0,
                    showAnimateBar: false,
                    showProgressBar: false,
                    showChangeSpeed: false,
                    ctrlDragProgress: false
                },
                progressParams: {
                    played: 0
                },
                modelObject: {},
                secretUrl: null,
                textureList: null,
                optionParams: {
                    showOrHide: false,
                    speed: 1,
                    totalTimes: 0
                },
                modelRelationship: {
                    renderer: null,
                    camera: null,
                    isFullScreen: false,
                    controls: null,
                    xyzAxisTitle: i18n.t('project.pro_showAxis'),
                    skeleton: null,
                    skeletonTitle: i18n.t('project.pro_showBones'),
                    isOnce: false,
                    onceTitle: i18n.t('project.pro_singlePlay')
                },
                animateSpeedTypes: [
                    {speed: '0.1', selected: false},
                    {speed: '0.5', selected: false},
                    {speed: '1', selected: true},
                    {speed: '2', selected: false}
                ]
            };
        },
        created () {

        },
        mounted () {
            this.getSecretUrl();
            this.initPage();
        },
        computed: {
            storeFileURl () {
                return this.$store.state.ImgVedioStatus.FileURl;
            },
            storeFileUrlList () {
                return this.$store.state.ImgVedioStatus.uploadCompleteUrlList;
            }
        },
        watch: {
            storeFileURl (url) {
                if (url) {
                    this.getSecretUrl();
                    this.initPage();
                }
            }
        },
        methods: {
            getSecretUrl () {
                let urlList = this.storeFileURl;
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
                    this.path = urlList.substring(0, lastNum + 1).replace('/file-out/', '/file-upload/');
                    if (index) {
                        let url = urlList.substring(0, index);
                        this.secretUrl = $.ajax({url: url, async: false}).responseText;
                    }
                }

                let fileListUrl = this.storeFileUrlList;
                fileListUrl.forEach((item, index) => {
                    let start = item.file.lastIndexOf('.');
                    let end = item.file.lastIndexOf('?');
                    let ext;
                    if (end > 0 && end > start) {
                        ext = item.file.substring(start, end).toLowerCase();
                    } else {
                        ext = item.file.substring(start).toLowerCase();
                    }

                    if (ext === '.3ds' || ext === '.fbx' || ext === '.obj' || ext === '.json' || ext === '.stl' || ext === '.mp4' || ext === '.rmvb' || ext === '.avi' || ext === '.zip') {
                        fileListUrl.splice(index, 1);
                    }
                });
                this.textureList = fileListUrl;
            },
            initPage () {
                $LAB.setOptions({AlwaysPreserveOrder: true})
                    .script('/static/three/three.js')
                    .script('/static/three/inflate.min.js')
                    .script('/static/three/TGALoader.js')
                    .script('/static/three/FBXLoader.js')
                    .script('/static/three/STLLoader.js')
                    .script('/static/three/TDSLoader.js')
                    .script('/static/three/DDSLoader.js')
                    .script('/static/three/OBJLoader.js')
                    .script('/static/three/Detector.js')
                    .script('/static/three/OrbitControls.js').wait(() => {
                        this.initModel();
                    }
                );
            },
            playPauseAnimate (status) {
                let object = this.modelObject;
                let objectAnimate = object.animations[0];
                let action = object.mixer.clipAction(objectAnimate);
                // action.paused = !action.paused;
                if (status === 'play') {
                    this.clock.stop();
                    this.animationParams.pauseTime = this.clock.elapsedTime;
                    this.playStatus = 'pause';
                    action.paused = true;
                } else {
                    this.clock.start();
                    this.clock.elapsedTime = this.animationParams.pauseTime;
                    this.playStatus = 'play';
                    action.paused = false;
                }
                // console.log(this.clock);
            },
            // 操作栏控制
            enterMouseDown (e) {
                this.animationParams.ctrlDragProgress = true;
                this.jumpToHere(e);
            },
            enterMouseMove (e) {
                if (this.animationParams.ctrlDragProgress) {
                    this.jumpToHere(e);
                }
            },
            enterMouseUp () {
                this.animationParams.ctrlDragProgress = false;
            },
            jumpToHere (e) {
                let el = document.querySelector('.model-preview-container');
                let pos = el.getBoundingClientRect();
                let currentPos = e.pageX - pos.left + 6;
                let percent = currentPos / el.offsetWidth;
                if (percent >= 0.9999) {
                    percent = 0.9999;
                }
                let model = this.modelObject;
                this.clock.elapsedTime = percent * this.animationParams.modelSeconds;
                this.animationParams.pauseTime = this.clock.elapsedTime;
                model.mixer._actions[0].time = this.clock.elapsedTime;
                this.progressParams.played = (this.clock.elapsedTime / this.animationParams.modelSeconds) * 100 + '%';
            },
            changeScreenSize () {
                let mainBox = document.getElementById('modelContainer');
                if (!this.modelRelationship.isFullScreen) {
                    let winWidth = window.innerWidth;
                    let winHeight = window.innerHeight;
                    mainBox.style.width = winWidth + 'px';
                    mainBox.style.height = winHeight + 'px';
                    this.modelRelationship.camera.aspect = winWidth / winHeight;
                    this.modelRelationship.camera.updateProjectionMatrix();
                    this.modelRelationship.renderer.setSize(winWidth, winHeight);
                } else {
                    mainBox.style.width = 960 + 'px';
                    mainBox.style.height = 593 + 'px';
                    this.modelRelationship.camera.aspect = 960 / 593;
                    this.modelRelationship.camera.updateProjectionMatrix();
                    this.modelRelationship.renderer.setSize(960, 593);
                }

            },
            // 全屏
            fullScreenOrNot () {
                let tdCanvasArea = document.getElementById('tdCanvasArea');
                this.modelRelationship.isFullScreen = !this.modelRelationship.isFullScreen;
                if (true) {
                    let docEle = document.documentElement;
                    //W3C
                    if (tdCanvasArea.requestFullscreen) {
                        tdCanvasArea.requestFullscreen();
                    }
                    //FireFox
                    else if (tdCanvasArea.mozRequestFullScreen) {
                        tdCanvasArea.mozRequestFullScreen();
                    }
                    //Chrome等
                    else if (tdCanvasArea.webkitRequestFullScreen) {
                        tdCanvasArea.webkitRequestFullScreen();
                    }
                    //IE11
                    else if (tdCanvasArea.msRequestFullscreen) {
                        tdCanvasArea.msRequestFullscreen();
                    }
                } else {
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
                // setTimeout(() => {
                //     this.changeScreenSize();
                // }, 500);
            },
            // 旋转
            autoRotate () {
                this.modelRelationship.controls.autoRotate = !this.modelRelationship.controls.autoRotate;
            },
            // 显示或隐藏坐标轴
            toggleAxis () {
                let subSceneList = this.scene.children;
                let axisVisible = subSceneList.filter(item => item.axisName === 'animateAxis');
                axisVisible.forEach(opt => {
                    opt.visible = !opt.visible;
                    this.modelRelationship.xyzAxisTitle = opt.visible ? i18n.t('project.pro_hiddenAxis') : i18n.t('project.pro_showAxis');
                });
            },
            // 显示隐藏骨骼
            toggleSkeleton () {
                if (this.modelRelationship.skeleton) {
                    this.modelRelationship.skeleton.visible = !this.modelRelationship.skeleton.visible;
                    this.modelRelationship.skeletonTitle = this.modelRelationship.skeleton.visible ? i18n.t('project.pro_hideTheSkeleton') : i18n.t('project.pro_showBones');
                }
            },
            // 单次或循环播放
            toggleAnimateInfinity () {
                this.modelRelationship.isOnce = !this.modelRelationship.isOnce;
                this.modelRelationship.onceTitle = this.modelRelationship.isOnce ? i18n.t('project.pro_Loop') : i18n.t('project.pro_singlePlay');
            },
            // 播放倍速
            toggleAnimateSpeed () {
                this.optionParams.showOrHide = !this.optionParams.showOrHide;
            },
            changeSpeed (speed) {
                this.animateSpeedTypes.forEach(item => item.selected = false);
                speed.selected = true;
                this.optionParams.speed = parseFloat(speed.speed);
                this.animationParams.modelSeconds = this.optionParams.totalTimes / this.optionParams.speed;
            },
            // 3d截图
            screenshot(){
                this.$emit('screenshotCanvas');
            },
            initModel () {
                let _this = this;
                if (!Detector.webgl) {Detector.addGetWebGLMessage();}
                let modelContainer, container, controls;
                let camera, scene, renderer, light;
                let modelSkeleton;
                let boxRange = {x: 1, y: 1, z: 1};
                let clock = new THREE.Clock();
                _this.clock = clock;
                let mixers = [];
                let containerWidth = document.getElementById('modelContainer').offsetWidth;
                let containerHeight = document.getElementById('modelContainer').offsetHeight;
                init();
                animate();

                // 时间计算
                function calculationTime (videoSeconds) {
                    if (videoSeconds <= 0) {
                        return '00:00';
                    }
                    if (videoSeconds > 0 && videoSeconds < 60) {
                        return '00:' + (Array(2).join("0") + parseInt(videoSeconds)).slice(-2);
                    }
                    if (videoSeconds >= 60 && videoSeconds < 3600) {
                        let minutes = (Array(2).join("0") + (parseInt(videoSeconds / 60))).slice(-2);
                        let seconds = (Array(2).join("0") + (parseInt(videoSeconds % 60))).slice(-2);
                        return minutes + ':' + seconds;
                    }
                    if (videoSeconds >= 3600) {
                        let hours = (Array(2).join("0") + (parseInt(videoSeconds / 3600))).slice(-2);
                        let minutes = (Array(2).join("0") + (parseInt((videoSeconds % 3600) / 60))).slice(-2);
                        let seconds = (Array(2).join("0") + (parseInt(videoSeconds % 60))).slice(-2);
                        return hours + ':' + minutes + ':' + seconds;
                    }
                }

                // 創建場景及环境贴图
                function createScene () {
                    let cubeTextureLoader = new THREE.CubeTextureLoader();
                    cubeTextureLoader.setPath('/static/three/scene_bg/');
                    //六张图片分别是朝前的（posz）、朝后的（negz）、朝上的（posy）、朝下的（negy）、朝右的（posx）和朝左的（negx）。
                    let cubeTexture = cubeTextureLoader.load([
                        'px.png', 'nx.png',
                        'py.png', 'ny.png',
                        'pz.png', 'nz.png'
                    ]);

                    scene = new THREE.Scene();
                    scene.background = cubeTexture;
                    _this.scene = scene;
                    // 将各对象渲染到场景中
                    createLight();
                    createGround();
                    createGround();
                    createAxisHelper();
                }

                // 创建灯光效果
                function createLight () {
                    // 角色灯光
                    light = new THREE.HemisphereLight(0xffffff, 0x444444);
                    light.position.set(0, 200, 0);
                    scene.add(light);
                    // 场景灯光
                    light = new THREE.DirectionalLight(0xffffff);
                    light.position.set(0, 200, 100);
                    light.castShadow = true;
                    light.shadow.camera.top = 180;
                    light.shadow.camera.bottom = -100;
                    light.shadow.camera.left = -120;
                    light.shadow.camera.right = 120;
                    scene.add(light);
                }

                // 创建地面
                function createGround () {
                    // Ground 地面
                    let mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(8000, 8000), new THREE.MeshPhongMaterial({
                        color: 0x999999,
                        depthWrite: false
                    }));
                    mesh.rotation.x = -Math.PI / 2;
                    mesh.receiveShadow = true;
                    scene.add(mesh);
                    // Grid 栅格
                    let grid = new THREE.GridHelper(8000, 50, 0x000000, 0x000000);
                    grid.material.opacity = 0.18;
                    grid.material.transparent = true;
                    scene.add(grid);
                }

                // 创建坐标轴
                function createAxisHelper() {
                    let axis = new THREE.AxesHelper(4000);
                    axis.axisName = 'animateAxis';
                    axis.visible = false;
                    scene.add(axis);
                }

                // 动画控制器
                function animationControl (object) {
                    _this.animationParams.showAnimateBar = true;
                    if (object.animations && object.animations.length > 0) {
                        _this.animationParams.showProgressBar = true;
                        _this.animationParams.showChangeSpeed = true;
                        _this.modelObject = object;
                        object.mixer = new THREE.AnimationMixer(object);
                        mixers.push(object.mixer);
                        object.mixer.clipAction(object.animations[0]).play();
                        modelSkeletonHelper(object);
                        createAnimateProgress(object);
                    }
                    autoChangeCamera(object);
                    // 调用截图方法
                    setTimeout(()=>{
                        _this.screenshot();
                    }, 800);
                }

                //模型骨骼助手
                function modelSkeletonHelper (object) {
                    modelSkeleton = new THREE.SkeletonHelper(object);
                    modelSkeleton.material.linewidth = 1;
                    modelSkeleton.visible = false;
                    _this.modelRelationship.skeleton = modelSkeleton;
                    scene.add(modelSkeleton);
                }

                //根据物体大小调整镜头
                function autoChangeCamera (object) {
                    let box = new THREE.Box3();
                    box.expandByObject(object);
                    boxRange.x = parseFloat(box.max.x);
                    boxRange.y = parseFloat(box.max.y);
                    boxRange.z = parseFloat(box.max.z);

                    camera.position.set(0, (parseFloat(box.max.z) < 2 ? 0.5 : parseFloat(box.max.z)) * 5, (parseFloat(box.max.y) < 2 ? 3 : parseFloat(box.max.y)) * 1.8);
                    modelController(object);
                }

                function modelController (object) {
                    //轨道控制插件
                    controls = new THREE.OrbitControls(camera, document.getElementById('modelContainer'));
                    controls.target.set(object.position.x, object.position.y + boxRange.y / 2, object.position.z);
                    controls.update();
                    _this.modelRelationship.controls = controls;
                }

                // 动画进度条相关
                function createAnimateProgress (object) {
                    let objectAnimate = object.animations[0];
                    _this.animationParams.modelSeconds = objectAnimate.duration;
                    _this.optionParams.totalTimes = _this.animationParams.modelSeconds;
                    let action = object.mixer.clipAction(objectAnimate);
                    _this.animationParams.totalTime = calculationTime(objectAnimate.duration);
                    action.play();
                }

                // Model loader progress
                let onProgress = function (xhr) {
                    if (xhr.lengthComputable) {
                        let percentComplete = xhr.loaded / xhr.total * 100;
                        console.log(Math.round(percentComplete, 2) + '% downloaded');
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
                        console.warn('无可用贴图格式！');
                        return [];
                    }
                }

                /**
                 * 常用贴图类型
                 *  { jpg, png, dds, tga ... }
                 */
                function loadTexture (url) {
                    let start = url.lastIndexOf('.');
                    let end = url.lastIndexOf('?');
                    let ext;
                    if (end > 0 && end > start) {
                        ext = url.substring(start + 1, end);
                    } else {
                        ext = url.substring(start + 1);
                    }
                    let texture;
                    switch (ext) {
                        case 'dds':
                            $LAB.setOptions({AlwaysPreserveOrder: true})
                                .script('/static/three/DDSLoader.js').wait(() => {
                                    let loader = new THREE.DDSLoader();
                                    texture = loader.load(url);
                                    texture.minFilter = texture.magFilter = THREE.LinearFilter;
                                });
                            break;
                        case 'tga':
                            $LAB.setOptions({AlwaysPreserveOrder: true})
                                .script('/static/three/TGALoader.js').wait(() => {
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
                    }
                    return texture;
                }

                function getTextureMap () {
                    if (_this.textureList && _this.textureList.length > 0) {
                        let textureImgList = _this.textureList;
                        let textureMap = textureImgList.map(item => ({
                            texture: loadTexture(item.file)
                        }));
                        return textureMap.filter(item => item.texture !== undefined);
                    }
                }

                // 布线 Wireframe
                function showWireframe (child) {
                    child.material.wireframe = true;
                    // child.material.color.setStyle('rgb(255, 255, 255)');
                    child.material.wireframeLinewidth = 1;
                    child.material.normalMap = null;
                    child.material.specularMap = null;
                    child.material.shininess = 3;
                }

                // 法线 Normal map
                function showNormalMap (child, normalTexture) {
                    child.material.wireframe = false;
                    child.material.specularMap = null;
                    child.material.shininess = 3;
                    // child.material.map = null;
                    child.material.normalMap = normalTexture;
                }

                // 高光 Specular map
                function showSpecularMap (child, specularTextureMap) {
                    child.material.normalMap = null;
                    child.material.wireframe = false;
                    // 添加高光贴图
                    if (specularTextureMap && specularTextureMap.length > 2) {
                        child.material.specularMap = specularTextureMap[2].texture;
                    }
                    //添加高光颜色
                    // child.material.specular = new THREE.Color(0xffffff);
                    //添加高光的平滑度，默认为30，值越高越强烈
                    child.material.shininess = 300;
                }

                function showAllModels (child, textureMap) {
                    child.material.wireframe = false;
                    child.material.normalMap = null;
                    child.material.specularMap = null;
                    child.material.shininess = 3;
                    child.material.map = textureMap[0] ? textureMap[0].texture : null;
                }

                /**
                 * FBX 模型加载
                 */
                function loadFBXModel (url) {
                    let tgaTexture;
                    if (_this.textureList && _this.textureList.length > 0) {
                        let textureImg = _this.textureList[0].file;
                        let extIndex = textureImg.lastIndexOf('.');
                        let ext = textureImg.substring(extIndex + 1);
                        if (ext === 'tga') {
                            tgaTexture = loadTexture(textureImg) || null;
                        }
                    }
                    let loader = new THREE.FBXLoader();
                    loader.load(url, _this.path, function (object) {
                        animationControl(object);
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
                    }, onProgress, onError);
                }

                /**
                 * 3DS 类型
                 */
                function load3DSModel (loadUrl) {
                    let textureMap = getTextureMap();
                    let loader = new THREE.TDSLoader();
                    loader.load(loadUrl, function (tdsObj) {
                        animationControl(tdsObj);
                        // tdsObj.traverse(child => {
                        //     if (child instanceof THREE.Mesh) {
                        //         if (textureMap && textureMap.length > 0) {
                        //             child.material.map = textureMap[0].texture;
                        //         }
                        //     }
                        // });
                        scene.add(tdsObj);
                    }, onProgress, onError);
                }

                /**
                 * Obj mtl 模型加载 （目前不支持 .mtl 格式文件上传）
                 */
                function loadObjMtlModel (url) {
                    let textUrl, clipUrl, textureFilterMap = filterTextureExt(_this.textureList);
                    let judgeIsMtl = textureFilterMap.filter(item => item.file.lastIndexOf('.mtl') !== -1);
                    if (judgeIsMtl && judgeIsMtl.length > 0) {
                        textUrl = judgeIsMtl[0].file;
                        let subUrl = textUrl.lastIndexOf('/');
                        clipUrl = textUrl.substring(0, subUrl + 1);
                        let textureName = textUrl.substring(subUrl + 1, textUrl.length);
                        let fileNum = url.lastIndexOf('/');
                        let fileName = url.substring(fileNum, url.length);
                        THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
                        $LAB.setOptions({AlwaysPreserveOrder: true})
                            .script('/static/three/MTLLoader.js').wait(() => {
                                new THREE.MTLLoader()
                                    .setPath(clipUrl)
                                    .load(textureName, function (materials) {
                                        materials.preload();
                                        new THREE.OBJLoader()
                                            .setMaterials(materials)
                                            // .setPath(clipUrl)
                                            .load(url, function (object) {
                                                animationControl(object);
                                                scene.add(object);
                                            }, onProgress, onError);
                                    });
                            }
                        );
                    } else {
                        $LAB.setOptions({AlwaysPreserveOrder: true})
                            .script('/static/three/OBJLoader.js').wait(() => {
                                let textureMap = getTextureMap();
                                let loader = new THREE.OBJLoader();
                                loader.load(url, function (objObject) {
                                    animationControl(objObject);
                                    objObject.traverse(function (child) {
                                        if (child instanceof THREE.Mesh) {
                                            if (textureMap && textureMap.length > 0) {
                                                child.material.map = textureMap[0].texture;
                                            }
                                        }
                                    });
                                    scene.add(objObject);
                                }, onProgress, onError);
                            }
                        );
                    }
                }

                /**
                 * Json 格式模型加载
                 */
                function loadJsonModel (url) {
                    let textureMap = getTextureMap();
                    let objectLoader = new THREE.ObjectLoader();
                    objectLoader.load(url, function (obj) {
                        animationControl(obj);
                        obj.traverse(function (child) {
                            if (child instanceof THREE.Mesh) {
                                if (textureMap && textureMap.length > 0) {
                                    child.material.map = textureMap[0].texture;
                                }
                            }
                        });
                        scene.add(obj);
                    }, onProgress, onError);
                }

                /**
                 * Json 格式模型加载2 （目前不支持 .js 格式文件上传）
                 */
                function loadJsModel (url) {
                    let jsonLoader = new THREE.JSONLoader();
                    jsonLoader.load(url, function (geometry, materials) {
                        let obj = new THREE.Mesh(geometry, materials);
                        animationControl(obj);
                        scene.add(obj);
                    }, onProgress, onError);
                }

                /**
                 * Stl 格式模型
                 */
                function loadStlModel (url) {
                    let textureMap = getTextureMap();
                    $LAB.setOptions({AlwaysPreserveOrder: true})
                        .script('/static/three/STLLoader.js').wait(() => {
                            let stlLoader = new THREE.STLLoader();
                            stlLoader.load(url, function (geometry) {
                                let material = new THREE.MeshStandardMaterial();
                                let mesh = new THREE.Mesh(geometry, material);
                                animationControl(mesh);
                                mesh.traverse(function (child) {
                                    if (child instanceof THREE.Mesh) {
                                        if (textureMap && textureMap.length > 0) {
                                            child.material.map = textureMap[0].texture;
                                        }
                                    }
                                });
                                scene.add(mesh);
                            // urlObject = mesh;
                            // _this.obj = urlObject;
                            // creatObjectInfo(mesh);
                            }, onProgress, onError);
                        });
                }

                function loadingModel (url) {
                    let urlList = _this.storeFileURl;
                    let indexOf = urlList.lastIndexOf('.');
                    let type = urlList.substring(indexOf).toLowerCase();
                    // _this.resourceCompleteLoading = true;
                    // readResourcePercent();
                    switch (type) {
                        case '.fbx':
                            // _this.showTdContainer = true;
                            loadFBXModel(url);
                            break;
                        case '.3ds':
                            // _this.showTdContainer = true;
                            load3DSModel(url);
                            break;
                        case '.obj':
                            // _this.showTdContainer = true;
                            loadObjMtlModel(url);
                            break;
                        case '.json':
                            // _this.showTdContainer = true;
                            loadJsonModel(url);
                            break;
                        case '.js':
                            loadJsModel(url);
                            break;
                        case '.stl':
                            loadStlModel(url);
                            break;
                        case '.max':
                        case '.dds':
                        case '.tga':
                            // _this.tdExtError = true;
                            // _this.showTdContainer = false;
                            // _this.resourceCompleteLoading = false;
                            break;
                    }
                }

                function init () {
                    modelContainer = document.getElementById('modelContainer');
                    container = document.createElement('div');
                    container.className = 'canvas-container';
                    modelContainer.appendChild(container);
                    camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 1, 8000);
                    camera.position.set(0, 200, 300);

                    // 添加场景
                    createScene();

                    // 加载模型
                    loadingModel(_this.secretUrl);

                    renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
                    renderer.setPixelRatio(window.devicePixelRatio);
                    renderer.setSize(containerWidth, containerHeight);
                    renderer.shadowMap.enabled = true;
                    renderer.domElement.id = 'tdCanvasArea';
                    _this.modelRelationship.renderer = renderer;
                    _this.modelRelationship.camera = camera;
                    container.appendChild(renderer.domElement);
                    window.addEventListener('resize', onWindowResize, false);
                }

                function onWindowResize () {
                    camera.aspect = containerWidth / containerHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(containerWidth, containerHeight);
                }

                // 动画播放相关
                function infinityPlay () {
                    let playType = 'infinity';
                    if (_this.modelRelationship.isOnce) {
                        playType = 'once';
                    }
                    if (clock.elapsedTime < _this.animationParams.modelSeconds) {
                        _this.animationParams.currentTime = calculationTime(clock.elapsedTime * _this.optionParams.speed);
                        _this.progressParams.played = (clock.elapsedTime / _this.animationParams.modelSeconds) * 100 + '%';
                    } else {
                        if (playType === 'infinity') {
                            clock.elapsedTime = 0;
                            _this.progressParams.played = (clock.elapsedTime / _this.animationParams.modelSeconds) * 100 + '%';
                        }
                        if (playType === 'once') {
                            let objectAnimate = _this.modelObject.animations[0];
                            let action = _this.modelObject.mixer.clipAction(objectAnimate);
                            action.paused = !action.paused;
                            _this.playStatus = 'pause';
                            _this.animationParams.currentTime = calculationTime(clock.elapsedTime);
                            clock.stop();
                            _this.progressParams.played = 100 + '%';
                            _this.animationParams.pauseTime = 0;
                        }
                    }
                }

                //
                function animate () {
                    requestAnimationFrame(animate);
                    if (mixers.length > 0) {
                        for (let i = 0; i < mixers.length; i++) {
                            mixers[i].update(_this.optionParams.speed * clock.getDelta());
                        }
                        infinityPlay();
                    }
                    if (controls) {controls.update();}
                    renderer.render(scene, camera);
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    /* 3d模型 */
    .model-preview-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        > .model-option-bar {
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            position: absolute;
            bottom: -40px;
            left: 0;
            width: 100%;
            height: 36px;
            padding: 8px 15px 5px 15px;
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6));
            -webkit-transition: all 0.3s;
            -moz-transition: all 0.3s;
            -ms-transition: all 0.3s;
            -o-transition: all 0.3s;
            transition: all 0.3s;
            > .play-progress {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: #fff;
                z-index: 9;
                color: #fff;
                cursor: pointer;
                > .played-progress {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 60%;
                    height: 3px;
                    background: linear-gradient(to right, rgba(60, 210, 180, 0.5), rgba(60, 210, 180, 1));
                    > span.played-point {
                        position: absolute;
                        right: 0;
                        top: -3.5px;
                        width: 10px;
                        height: 10px;
                        -webkit-border-radius: 50%;
                        -moz-border-radius: 50%;
                        border-radius: 50%;
                        border: 2px solid @base;
                        background: #fff;
                        -webkit-transition: all 0.3s;
                        -moz-transition: all 0.3s;
                        -ms-transition: all 0.3s;
                        -o-transition: all 0.3s;
                        transition: all 0.3s;
                        cursor: pointer;
                        &.width-zero {
                            left: 0;
                        }
                        &:hover {
                            width: 12px;
                            height: 12px;
                            top: -4px;
                            border-color: #fff;
                            background: @base;
                        }
                    }
                }
            }
            > .model-info {
                float: left;
                height: 23px;
                > a {
                    float: left;
                    display: block;
                    height: 23px;
                    line-height: 23px;
                    text-align: left;
                }
                > a.play-pause-option {
                    width: 28px;
                    border-right: 1px solid #f9f9f9;
                    cursor: pointer;
                    > i {
                        font-size: 20px;
                        color: #fff;
                        line-height: 23px;
                        -webkit-transition: all 0.3s;
                        -moz-transition: all 0.3s;
                        -ms-transition: all 0.3s;
                        -o-transition: all 0.3s;
                        transition: all 0.3s;
                    }
                    &:hover {
                        > i {
                            color: @base;
                        }
                    }
                }
                > a.display-time-info {
                    color: #fff;
                    font-size: 12px;
                    padding: 0 15px;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    > label {
                        float: left;
                    }
                    > span {
                        float: left;
                        margin: -1px 2px 0;
                    }
                }
            }
            > .operate-option {
                float: right;
                height: 23px;
                > ul {
                    display: flex;
                    justify-content: space-between;
                    flex-direction: row-reverse;
                    > li {
                        position: relative;
                        margin-left: 15px;
                        cursor: pointer;
                        > i {
                            font-size: 23px;
                            color: #fff;
                            line-height: 23px;
                            /*-webkit-transition: all 0.3s;*/
                            /*-moz-transition: all 0.3s;*/
                            /*-ms-transition: all 0.3s;*/
                            /*-o-transition: all 0.3s;*/
                            /*transition: all 0.3s;*/
                        }
                        &.exit-full-screen {
                            > i {
                                font-size: 20px;
                            }
                        }
                        &:hover {
                            > i {
                                color: @base;
                            }
                        }
                        &.auto-rotate {
                            > i {
                                font-size: 20px;
                            }
                        }
                        &.toggle-axis {
                            > i {
                                font-size: 18px;
                            }
                        }
                        &.toggle-skeleton {
                            > i {
                                font-size: 18px;
                            }
                        }
                        &.toggle-once-infinity {
                            > i {
                                display: block;
                                width: 16px;
                                /*height: 20px;*/
                            }
                            > i.icon-inside-cycle {
                                font-size: 21px;
                            }
                            > i.icon-onecycle {
                                font-size: 16px;
                            }
                        }
                        &.toggle-animate-speed {
                            > i {
                                font-size: 18px;
                            }
                            > .speed-type {
                                position: absolute;
                                bottom: 45px;
                                width: 120px;
                                padding: 5px;
                                margin-left: -50px;
                                background: rgba(255, 255, 255, 0.95);
                                -webkit-border-radius: 3px;
                                -moz-border-radius: 3px;
                                border-radius: 3px;
                                z-index: 10;
                                > .down-triangle-icon {
                                    position: absolute;
                                    bottom: -9px;
                                    right: 52px;
                                    width: 0;
                                    height: 0;
                                    border-width: 9px 8px 0 8px;
                                    border-style: solid;
                                    border-color: rgba(255, 255, 255, 0.95) transparent transparent;
                                }
                                > ul {
                                    display: flex;
                                    flex-wrap: wrap;
                                    justify-content: space-around;
                                    > li {
                                        width: 45%;
                                        padding: 3px 0;
                                        margin-bottom: 3px;
                                        font-size: 12px;
                                        text-align: center;
                                        color: #666;
                                        -webkit-border-radius: 3px;
                                        -moz-border-radius: 3px;
                                        border-radius: 3px;
                            -webkit-transition: all 0.3s;
                            -moz-transition: all 0.3s;
                            -ms-transition: all 0.3s;
                            -o-transition: all 0.3s;
                            transition: all 0.3s;
                                        &:hover {
                                            background: rgba(60, 210, 180, 0.4);
                                        }
                                        &.selected-speed {
                                            background: rgba(60, 210, 180, 1);
                                            color: #fff;
                                        }
                                    }
                        }
                            }
                        }
                    }
                }
                            }
                        }
                        &:hover {
            .model-option-bar {
                bottom: 0;
            }
        }
    }
</style>
