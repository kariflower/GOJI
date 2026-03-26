# Persona Competition Dashboard MVP Spec

## 1. 目的

GOJIの提案コンペを、`セッション横断`かつ`phase別`に定量評価できるようにする。
主目的は以下の3点。

1. どのペルソナが、どのphaseで、どれだけ採択されているかを可視化する
2. 採択/落選の差を、得票（like/dislike/tally/controversy）で説明できるようにする
3. 仕様変更（プロンプト・カタログ・投票ルール）の前後比較を可能にする

## 2. MVP範囲

対象phase:

1. `phase2a`
2. `phase3`
3. `phase4a`
4. `phase4s`

対象指標（MVP）:

1. 提案数
2. 採択数
3. 採択率（採択数 / 提案数）
4. 平均得票（like, dislike, tally, controversy）
5. 決選投票率（is_tiebreak）
6. GOJI介入率（goji_voteが実行された割合）

## 3. データ品質ルール（重要）

可視化時に、以下を必ず表示する。

1. `phase4a` の旧セッションは `random_constraints.per_persona` 欠損があるため、
   proposal-levelの tone/genre 分析は「不完全データ」バッジを付与する
2. phase別に `dimension_sessions`（有効データのあるセッション数）を表示する
3. 分母ゼロの率は `N/A` 表示にする

## 4. 正規化データスキーマ（MVP）

## 4.1 competition_event（1行=1提案）

```json
{
  "session_id": "session-20260322-165429-3acb",
  "phase": "phase2a|phase3|phase4a|phase4s",
  "proposal_id": "phase4a-...",
  "proposal_index": 0,
  "persona_id": "persona-xxxx",
  "persona_name": "...",
  "winner": 0,
  "winner_key": "A|B|C",
  "tiebreak": 0,
  "goji_intervened": 0,
  "like": 0,
  "dislike": 0,
  "tally": 0,
  "controversy": 0.0,
  "catalog_dimension": "phase1_base|phase2_condition|phase3_anchor|tone|genre|style|keyword",
  "catalog_id": "p1-011|carnival|found_footage|...",
  "catalog_label": "道化師|カーニバル|...",
  "data_quality": "ok|incomplete"
}
```

## 4.2 persona_phase_summary（1行=1ペルソナ×1phase）

```json
{
  "persona_id": "persona-xxxx",
  "persona_name": "...",
  "phase": "phase2a",
  "proposals": 12,
  "wins": 3,
  "win_rate": 0.25,
  "avg_like": 4.2,
  "avg_dislike": 3.8,
  "avg_tally": 8.0,
  "avg_controversy": 0.41
}
```

## 4.3 phase_kpi_summary（1行=1phase）

```json
{
  "phase": "phase4a",
  "sessions_total": 38,
  "sessions_usable": 10,
  "proposals_total": 30,
  "tiebreak_rate": 0.13,
  "goji_intervention_rate": 0.08,
  "catalog_coverage": 0.875,
  "hhi": 0.056,
  "top1_share": 0.10
}
```

## 5. 画面仕様（MVP）

## 5.1 Overview

表示:

1. phaseごとの KPI カード（sessions_total / sessions_usable / proposals / tiebreak率）
2. phaseごとの カタログ偏り（HHI, top1_share）
3. データ品質警告（欠損数）

## 5.2 Persona × Phase マトリクス

表示:

1. 行: persona
2. 列: phase
3. セル: 採択率（色） + 提案数/採択数（テキスト）

操作:

1. phaseフィルタ
2. セッション期間フィルタ
3. 最低提案数フィルタ

## 5.3 Proposal Distribution

表示:

1. 採択 vs 落選の like/dislike/tally/controversy 分布（phase別）
2. 箱ひげ or バイオリン + 平均線

目的:

1. 「何が勝つか」の得票特性を可視化

## 5.4 Catalog Performance

表示:

1. phase別 catalog item ランキング
2. 列: proposal_count / winner_count / adoption_given_usage

補助:

1. 高露出低採択（要見直し）
2. 低露出高採択（伸ばす候補）

## 5.5 Session Timeline

表示:

1. セッション時系列での win_rate, tiebreak率, HHI 推移
2. 仕様変更日の縦線（注釈）

## 6. 実装アーキテクチャ（最小）

入力:

1. `docs/analysis/catalog_audit_20260323/*.csv`

出力:

1. `docs/analysis/catalog_audit_20260323/dashboard_data.json`
2. `docs/analysis/catalog_audit_20260323/dashboard.html`

処理:

1. ETL: CSV -> competition_event 正規化
2. 集約: persona_phase_summary / phase_kpi_summary 生成
3. フロント: 静的HTML + JS（ローカル/Pagesで閲覧可能）

## 7. KPI定義（固定）

1. `win_rate = wins / proposals`
2. `adoption_given_usage = winner_count / proposal_count`
3. `tiebreak_rate = tiebreak_sessions / sessions_usable`
4. `goji_intervention_rate = goji_intervened_sessions / sessions_usable`
5. `catalog_coverage = used_items / catalog_total`
6. `hhi = Σ(share_i^2)`
7. `top1_share = max(item_count) / total_item_count`

## 8. Done条件（MVP）

1. 全phaseの KPI が1画面で確認できる
2. 任意ペルソナの phase別採択率を1クリックで表示できる
3. 採択/落選の得票分布をphase別に比較できる
4. データ不完全セッションが明示される
5. CSV更新後に再生成して同じ手順で更新できる

## 9. 次段（MVP後）

1. 仕様変更前後の A/B 比較ビュー
2. ペルソナクラスタ分析（提案傾向の類似性）
3. カタログ要素共起ネットワーク（winner寄与の可視化）
