window.SESSION_MANIFEST = Object.freeze((function(){
  const payload = 
{
  "generated_at": "2026-03-09T17:19:17Z",
  "source": "publish_sessions_to_public_repo",
  "sessions": [
    {
      "session_id": "session-20260308-073956-c0d9",
      "path": "./session-20260308-073956-c0d9/assets/instructions/index.html",
      "generated_at": "2026-03-08T03:20:45.302928Z",
      "clip_count": 71,
      "duration_sec": 263.7599999999999,
      "section_count": 8,
      "summary": "深夜のコンビニ、レジカウンターの内側。20代前半の女性店員——道化師の仮面をつけた巨大な頭を持つ存在として描かれる——は、自動ドアが開くたびに条件反射で「いらっしゃいませ」と口を動かす。誰も来ない。光が有限な世界では、このコンビニだけが不自然に明るく、魔法陣床から汲み上げた光を湯水のように使い続けている。彼女の足元の幾何学文様は踏むたびに色を変えるが、彼女はもう色の変化に気づかなくなって久しい。3回目の空振りで、ようやく自分が笑い始め…",
      "song_file": "オブラーテッド.mp3"
    },
    {
      "session_id": "session-20260302-130453-4a87",
      "path": "./session-20260302-130453-4a87/assets/instructions/index.html",
      "generated_at": "2026-03-08T02:41:41.117286Z",
      "clip_count": 67,
      "duration_sec": 213.6,
      "section_count": 8,
      "summary": "ぬらりひょんが画面と現実の境界に物理的に挟まることで、少年の参照依存を視覚化する。街の感情音に接続できない部屋の静寂が少年の内側に蓄積した音圧の証拠となり、画面消去が唯一の排出口として機能する。 目標は画面を消した後も少年の体が踊り続けるかどうか——その一点に向けて3分半を費やす。答えが出た瞬間、喜びか恐怖か判別できない設計。 深夜の6畳間。少年が教科書タワーのスマートフォンで自撮り動画を再生する。部屋だけが静寂——街の感情音が届かな…",
      "song_file": "わからないから.mp3"
    }
  ]
}
;
  const rows = Array.isArray(payload.sessions) ? payload.sessions : [];
  return rows.map(function(x){ return Object.freeze(x); });
})());
