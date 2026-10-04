# 艾諾 Online — FBX 架構檢查 V2

## 1. T-POSE_武家.fbx 實際結構
- FBX 版本：7700
- Geometry：1 個
- Material：0 個
- Texture：0 個
- Video：0 個
- Model：34 個（1 個 mesh_node + 33 個 Mixamo 骨架節點）
- Deformer/Cluster：29 個
- Polygon：由單一 Geometry 提供

## 2. 骨架
保留 Mixamo：
Hips / Spine / Spine1 / Spine2 / Neck / Head / HeadTop_End
Left/Right Shoulder / Arm / ForeArm / Hand / HandIndex1-4
Left/Right UpLeg / Leg / Foot / ToeBase / Toe_End

遊戲仍壓縮成 18 根控制骨，手指與腳趾權重會合併到 Hand/Foot。

## 3. 前一版真正的問題
FBX 本身沒有材質與貼圖，因此不能把「FBX 原色」當成服裝材質。
前一版把參考 PNG 投影成 vertex color，再用場景 Lambert 光照與 emissive 疊加；結果：
- 臉部容易被頭髮顏色覆蓋
- 手腳、肩部會被參考圖的亮色污染
- 背面沒有可靠的服裝顏色來源
- 法師的 gamma=.78 會直接把灰白色往白推
- 武道家主色被原圖亮度／場景光共同影響

## 4. V2 修正
- 不再把參考圖白平衡當成最終材質。
- 法師：以固定高彩度綠色階＋幾何區域重建主服、深色內層、金飾、肉色與翠綠眼睛。
- 武道家：以固定黑／鮮紅／金色階＋幾何區域重建服裝，臉、手、鞋、眼睛獨立處理。
- 法師與武道家 emissive intensity 從 0.55 降至 0.10，避免夜間場景把角色洗白。
- 聖職者／盜賊／戰士的模型資料不改動；其既有 HeroDetail 保持獨立。

## 5. 驗證
- hero-detail.js Node syntax：PASS
- hero-model.js Node syntax：PASS
- hero-tone.test.js：PASS
