// 初始化场景
    init() {
      //获得div并添加容器
      var container, controls;//容器、统计?、控制器
      var camera, scene, renderer, light;//相机、场景、渲染、灯光
      var mixers = [];

      container = document.createElement('div');
      document.getElementById("maind").appendChild(container);
      //设置相机(视角,纵横比,近距离,远距离)
      camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 2000);
      camera.position.set(100, 200, 300);
      //轨道控制插件
      controls = new THREE.OrbitControls(camera);
      controls.target.set(0, 100, 0);
      controls.update();
      //场景
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xa0a0a0);
      scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
      //半球光
      light = new THREE.HemisphereLight(0xffffff, 0x444444);
      light.position.set(0, 200, 0);
      scene.add(light);
      //日光
      light = new THREE.DirectionalLight(0xffffff);
      light.position.set(0, 200, 100);
      light.castShadow = true;
      light.shadow.camera.top = 180;
      light.shadow.camera.bottom = -100;
      light.shadow.camera.left = -120;
      light.shadow.camera.right = 120;
      scene.add(light);

      //mesh
      var mesh = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(2000, 2000),
        new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
      mesh.rotation.x = - Math.PI / 2;
      mesh.receiveShadow = true;
      scene.add(mesh);
      //地面
      var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
      grid.material.opacity = 0.2;
      grid.material.transparent = true;
      scene.add(grid);
      //加载
      var loader = new THREE.FBXLoader();
      // let url3 = "http://192.168.2.19/index.php?r=file/file/get-file&fid=1145";
      let url2 = '../src/views/project/components/threeFile/M_atk.fbx';
      // let url2 = '../src/views/project/components/threeFile/M_idle.fbx';
      // let url2 = '../src/views/project/components/threeFile/test.fbx';
      // let url2 = this.fbxurl;
      // console.log('获取返回数据中的文件', url2)
      let url4 = "https://threejs.org/examples/models/fbx/Samba%20Dancing.fbx";
      // console.log(loader);

      loader.load(url2, function(object) {
        // console.log(object);

        object.mixer = new THREE.AnimationMixer(object);
        mixers.push(object.mixer);
        var action = object.mixer.clipAction(object.animations[0]);
        action.play();
        object.traverse(function(child) {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(object);
      });
      //渲染
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);
      window.addEventListener('resize', this.onWindowResize, false);
      // 初始化成功后加载动画
      this.animate(scene, camera);
    },
    //窗口重置
    onWindowResize() {
      // var camera;
      // camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 2000);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    //动画
    animate(scene, camera) {
      var clock = new THREE.Clock();//时钟
      var mixers = [];
      requestAnimationFrame(animate);
      if (mixers.length > 0) {
        for (var i = 0; i < mixers.length; i++) {
          mixers[i].update(clock.getDelta());
        }
      }
      renderer.render(scene, camera);
    }