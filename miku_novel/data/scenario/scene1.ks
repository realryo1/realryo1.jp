[_tb_system_call storage=system/_scene1.ks]

[bg  time="1000"  method="crossfade"  storage="PXL_20240815_201952147.PANO.jpg"  ]
[tb_show_message_window  ]
[tb_start_text mode=1 ]
朝の東京駅に、発車案内のチャイムが響く。[r]俺は指定席のチケットを握りしめたまま、人混みの中で立ち止まった[p]
「おーい、こっちこっち！」[p]
[_tb_end_text]

[chara_show  name="初音ミク"  time="1000"  wait="true"  storage="chara/1/やった～_-_コピー.png"  width="651"  height="960"  left="312"  top="1"  reflect="false"  ]
[tb_start_text mode=1 ]
振り返ると、水色のツインテールを揺らしながら手を振る少女がいた。[r]うちの初音ミク。今日もかわいいなぁ[p]
[_tb_end_text]

[chara_mod  name="初音ミク"  time="600"  cross="false"  storage="chara/1/喋り_普通.png"  ]
[tb_start_text mode=1 ]
ミク「待たせた？ 駅構内、やっぱり迷路だねぇ」[p]
俺「ギリギリじゃないだけマシだな」[p]
ミク「ふふ、今日はちゃんと“余裕のある大人の旅”だよ」[p]
ちょっと天井の低いコンコースに人の波が広がっている。[r]頭上の案内板には遠くの都市の名前が書かれていた[p]
[_tb_end_text]

[glink  color="green"  storage="scene1.ks"  size="20"  text="8:00　はつね　5号&nbsp;札幌　17両編成"  autopos="false"  target="*Sapporo"  y="267"  x="435"  width=""  height=""  _clickable_img=""  ]
[s  ]
*Sapporo

[tb_eval  exp="f.city=1"  name="city"  cmd="="  op="t"  val="1"  val_2="undefined"  ]
[tb_start_text mode=1 ]
案内板を見上げながら、俺は北海道新幹線の時刻表を確認する。[r]朝8時に東京を出た列車は、13時ちょうどに札幌へ着く。[p]
俺「今日は北かな。北海道新幹線で札幌へ」[p]
[_tb_end_text]

[chara_mod  name="初音ミク"  time="600"  cross="false"  storage="chara/1/やった～_-_コピー.png"  ]
[tb_start_text mode=1 ]
ミク「了解、ミクの実家コースだね！」[p]
常盤グリーン色の新幹線に乗り込み、僕たちは東京を後にした。[p]
[_tb_end_text]

[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[jump  storage="scene2_food_sapporo.ks"  target="*top"  ]
