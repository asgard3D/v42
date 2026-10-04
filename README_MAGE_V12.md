# 法師 V12 — FBX 架構重建

這次修正不是再調色，而是重做法師的「參考圖投影」流程。

## 找到的根本問題
- `mage.fbx` 與 `T-Pose(1).fbx`、`T-Pose(2).fbx` 為完全相同檔案。
- FBX 只有 1 個 Geometry、Mixamo 34 骨架與 Skin/Cluster；沒有 Material、Texture、UV。
- 因此法師服飾本身不是 FBX 材質，而是後處理投影到頂點色。
- 舊版 `fitparams_raw.npy` 的角色投影落在錯誤高度，原本的 mask 也只抓到下半身，導致臉、肩膀與頭髮取得錯誤顏色。

## V12
- 先完成 30° T-pose → A-pose，再進行服飾參考圖投影。
- 正面使用乾淨透明人物圖。
- 側面／背面重新建立完整人物遮罩。
- 依正／側／背法線選擇投影來源。
- 保留參考圖原始紋理，只做輕微 gamma / saturation 提升。
- 不再用 y 高度猜測「臉／肩／白色」等材質區域。
- 18 骨架與原 Mixamo 權重維持。
