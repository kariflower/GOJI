# Catalog Audit - Deep Analysis Report

## 1. 解析対象と信頼性

- 対象セッション総数: **82**
- `phase2` が辞書として存在: **71**
- `phase3` が辞書として存在: **71**
- `phase4a` が辞書として存在: **38**
- `phase4s` が辞書として存在: **11**
- unresolved label: **0件**（ラベル→カタログ対応の未解決なし）
- anomalies: **28件**（内訳は後述）

### データ完全性に関する重要注記

- `phase3.candidate_keywords` の実計測セッション数: **46**（phase3存在71中）
- `phase4a.tone/genre` の実計測セッション数: **10**（phase4a存在38中）
- したがって、phase4aのトーン/ジャンル分析は**最新実装が入った一部セッション**に対する結果です。

## 2. phase別サマリー（使用率・偏り）

- **phase2.phase1_base**: used 67/99 (ratio=0.677), HHI=0.032, top1_share=0.094, dimension_sessions=71
- **phase2.phase2_condition**: used 105/126 (ratio=0.833), HHI=0.016, top1_share=0.038, dimension_sessions=71
- **phase2.phase3_anchor**: used 60/94 (ratio=0.638), HHI=0.031, top1_share=0.060, dimension_sessions=71
- **phase3.candidate_keywords**: used 188/188 (ratio=1.000), HHI=0.005, top1_share=0.008, dimension_sessions=46
- **phase4a.tone**: used 21/24 (ratio=0.875), HHI=0.056, top1_share=0.100, dimension_sessions=10
- **phase4a.genre**: used 16/18 (ratio=0.889), HHI=0.078, top1_share=0.133, dimension_sessions=10
- **phase4s.style**: used 15/16 (ratio=0.938), HHI=0.074, top1_share=0.091, dimension_sessions=11

解釈:
- HHIが高いほど、少数要素に提案が集中しています。
- top1_shareは「最頻出1要素が全提案露出の何割か」を示します。

## 3. phase2（min_features_catalog）詳細

### phase1_base
- 採択上位（winner_count順）:
  - 道化師 (p1-011): winner=7, proposal=20, adoption=0.350
  - 鹿 (p1-018): winner=4, proposal=6, adoption=0.667
  - 蛾 (p1-045): winner=4, proposal=7, adoption=0.571
  - 孔雀 (p1-035): winner=4, proposal=8, adoption=0.500
  - 巫女 (p1-010): winner=4, proposal=13, adoption=0.308
- 露出は多いが未採択（見直し候補）:
  - 忍者 (p1-002): proposal=9, winner=0
  - フクロウ (p1-029): proposal=8, winner=0
  - 甲冑兵 (p1-007): proposal=4, winner=0
- 低露出だが高効率（拡張候補）:
  - ハーピー (p1-074): proposal=2, winner=2, adoption=1.000
  - 狐 (p1-015): proposal=1, winner=1, adoption=1.000
  - 鼠 (p1-024): proposal=1, winner=1, adoption=1.000
  - ヤギ (p1-026): proposal=1, winner=1, adoption=1.000
  - 鴉 (p1-027): proposal=1, winner=1, adoption=1.000

### phase2_condition
- 採択上位（winner_count順）:
  - 背中の棘 (p2-052): winner=8, proposal=9, adoption=0.889
  - 六本腕 (p2-033): winner=5, proposal=9, adoption=0.556
  - 長い指 (p2-062): winner=5, proposal=9, adoption=0.556
  - 逆関節 (p2-100): winner=5, proposal=15, adoption=0.333
  - 扁平頭 (p2-078): winner=5, proposal=16, adoption=0.312
- 露出は多いが未採択（見直し候補）:
  - 縦長の瞳 (p2-007): proposal=8, winner=0
  - 扁平胴体 (p2-050): proposal=7, winner=0
  - 羽毛 (p2-025): proposal=6, winner=0
  - 体毛 (p2-026): proposal=6, winner=0
- 低露出だが高効率（拡張候補）:
  - 凹凸肌 (p2-096): proposal=3, winner=3, adoption=1.000
  - 複数触手 (p2-021): proposal=2, winner=2, adoption=1.000
  - 多関節脚 (p2-031): proposal=2, winner=2, adoption=1.000
  - 細い尾 (p2-081): proposal=2, winner=2, adoption=1.000
  - 四本足 (p2-041): proposal=1, winner=1, adoption=1.000

### phase3_anchor
- 採択上位（winner_count順）:
  - 鎖の首輪 (p3-014): winner=6, proposal=13, adoption=0.462
  - 骨の首飾り (p3-059): winner=5, proposal=10, adoption=0.500
  - 背負い旗 (p3-030): winner=5, proposal=11, adoption=0.455
  - 口枷 (p3-076): winner=5, proposal=13, adoption=0.385
  - 王冠 (p3-006): winner=4, proposal=6, adoption=0.667
- 露出は多いが未採択（見直し候補）:
  - 顔の刻印 (p3-038): proposal=6, winner=0
- 低露出だが高効率（拡張候補）:
  - 石の首飾り (p3-061): proposal=2, winner=2, adoption=1.000
  - 義手 (p3-023): proposal=1, winner=1, adoption=1.000
  - 羽飾り (p3-035): proposal=1, winner=1, adoption=1.000
  - 体の紋章 (p3-041): proposal=1, winner=1, adoption=1.000
  - ひび割れ (p3-046): proposal=1, winner=1, adoption=1.000

## 4. phase3（world_setting_catalog / keyword提示）詳細

- candidate_keywordsのカタログ使用: **188/188要素**（=全要素）
- phase3 proposal単位で selected_set_id が入っている比率: **136/137**
- selected_set_keywordsで実際に使われた要素数: **188**
- selected_overlap_keywordsで実際に使われた要素数: **176**
- 採択上位キーワード:
  - 桟橋: winner=26, proposal=63, adoption=0.413
  - 磁気レール: winner=24, proposal=51, adoption=0.471
  - 郵便ポスト: winner=24, proposal=53, adoption=0.453
  - 配電箱: winner=23, proposal=50, adoption=0.460
  - 黄線: winner=23, proposal=51, adoption=0.451
  - 空中橋: winner=23, proposal=53, adoption=0.434
  - 自販機: winner=23, proposal=53, adoption=0.434
  - 光の帯: winner=22, proposal=55, adoption=0.400
  - ルーン柱: winner=21, proposal=55, adoption=0.382
  - 燧石山: winner=21, proposal=56, adoption=0.375

解釈:
- phase3は候補提示の分散が高く（HHI=0.005）、単一要素への偏りは小さいです。
- ただしこの分析は、`_phase3_keyword_debug.candidate_sets` が残るセッションに限定されます。

## 5. phase4a（constraint_catalog: tone/genre）詳細

- phase4aセッション: 38
- tone割当が取れるセッション: 10
- genre割当が取れるセッション: 10
- 採択上位tone:
  - カーニバル (carnival): winner=1, proposal=1
  - サイケデリック (psychedelic): winner=1, proposal=1
  - 80sシンセウェーブ (80s_synthwave): winner=1, proposal=2
  - ブルータリスト (brutalist): winner=1, proposal=2
  - メディカル/臨床 (medical_clinical): winner=1, proposal=2
  - ネオンノワール (neon_noir): winner=1, proposal=2
  - ノワール (noir): winner=1, proposal=2
  - ポラロイド (polaroid_snapshot): winner=1, proposal=2
- 採択上位genre:
  - バンドセッション (band_session): winner=2, proposal=2
  - ファッション (fashion): winner=2, proposal=4
  - コメディ (comedy): winner=1, proposal=1
  - クッキング (cooking): winner=1, proposal=1
  - ハイスト (heist): winner=1, proposal=1
  - ホラー (horror): winner=1, proposal=1
  - 一日密着 (day_in_life): winner=1, proposal=2
  - コレオグラフィ (choreography): winner=1, proposal=3

解釈:
- 最新実装群ではtone/genreの使用カバレッジは高い（tone 21/24, genre 16/18）一方、
- 旧実装セッションでは `per_persona` が不足しており、proposal単位の厳密分析ができません。

## 6. phase4s（constraint_catalog: style）詳細

- phase4sセッション: 11 / style割当取得: 11
- 採択上位style:
  - ファウンドフッテージ (found_footage): winner=2, proposal=2, adoption=1.000
  - 万華鏡 (kaleidoscope): winner=2, proposal=2, adoption=1.000
  - ロトスコープ (rotoscope): winner=2, proposal=2, adoption=1.000
  - 逆再生 (reverse_motion): winner=2, proposal=3, adoption=0.667
  - ワンテイク (one_take): winner=1, proposal=1, adoption=1.000
  - パペット/クレイ (puppet_claymation): winner=1, proposal=2, adoption=0.500
  - 水中 (underwater): winner=1, proposal=3, adoption=0.333
- 未使用style: スプリットスクリーン

## 7. 異常・欠損の分析

- anomaly総数: 28
- phase4a.per_persona_shorter_than_proposals: 28

主因:
- `phase4a.per_persona_shorter_than_proposals` が全件。
- これは旧セッションでproposalごとのtone/genre割当が保存されていないためで、分析可能範囲を狭めています。

## 8. カタログ見直しアクション提案（データ起点）

1. phase2: 「高露出・低採択」要素を縮退候補としてタグ再設計する。
2. phase2: 「低露出・高採択」要素を候補出現率でブーストし、探索幅を維持したまま採択効率を上げる。
3. phase3: candidate_setsは十分分散しているため、次は「winner寄与が高いキーワード束」の共起分析に進む。
4. phase4a: 全セッションで `per_persona` を保存するよう統一し、比較可能性を確保する。
5. phase4s: 未使用styleを意図的に露出させる探索モード（低頻度優先サンプリング）を追加する。

