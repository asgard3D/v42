/* Three.js 場景、相機、燈光、地面 */
const SG=new THREE.ConeGeometry(1,1,4);
const scene=new THREE.Scene();scene.background=new THREE.Color(0x0e2418);scene.fog=new THREE.Fog(0x10281c,20,50);
const cam=new THREE.PerspectiveCamera(40,1,.1,200);
const ren=new THREE.WebGLRenderer({antialias:true});ren.setPixelRatio(Math.min(devicePixelRatio,2));ren.shadowMap.enabled=true;
document.body.prepend(ren.domElement);
function rs(){ren.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}
addEventListener('resize',rs);rs();
const hemi=new THREE.HemisphereLight(0xbcd4ff,0x223322,.9);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff0d0,.8);sun.position.set(8,14,6);sun.castShadow=true;
sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-14,right:14,top:14,bottom:-14});
scene.add(sun,sun.target);
const M=(c,e)=>new THREE.MeshLambertMaterial({color:c,emissive:e||0});
const ground=new THREE.Mesh(new THREE.PlaneGeometry(80,80),M(0x24512f));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
const grid=new THREE.GridHelper(80,40,0x3f8058,0x3f8058);grid.material.opacity=.25;grid.material.transparent=true;grid.position.y=.01;scene.add(grid);
