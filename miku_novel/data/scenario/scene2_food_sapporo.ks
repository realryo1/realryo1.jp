[_tb_system_call storage=system/_scene2_food_sapporo.ks]

*top

[chara_hide_all  time="0"  wait="false"  ]
[bg  time="1000"  method="crossfade"  storage="2defd3e7.jpg"  ]
[mask_off  time="1000"  effect="fadeOut"  ]
[tb_show_message_window  ]
[tb_start_text mode=1 ]
13:00　札幌駅[p]
[_tb_end_text]

[chara_show  name="初音ミク"  time="1000"  wait="true"  storage="chara/1/やった～_-_コピー.png"  width="651"  height="960"  left="312"  top="1"  reflect="false"  ]
[tb_start_text mode=1 ]
ミク「はい、時刻は13時！ 東京"駅"から5時間座ってるだけで札幌って、ちょっと変な感じ！」[p]
[_tb_end_text]

[chara_mod  name="初音ミク"  time="600"  cross="false"  storage="chara/1/んま～.png"  ]
[tb_start_text mode=1 ]
俺「数年前までは羽田に行って保安検査して、新千歳着いても快速エアポート乗って……旅情が失われたか？[r]って、もうそんな顔して……」[p]
ミク「あったりまえじゃん！新幹線で牛肉どまんなか食べたけどもうおなかすいたよ！」[p]
ミク「ミクは味噌ラーメンかスープカレーがいいなぁ」[p]
[_tb_end_text]

[glink  color="green"  storage="scene2_food_sapporo.ks"  size="20"  text="味噌ラーメン"  autopos="false"  target="*ramen"  y="270"  x="553"  width=""  height=""  _clickable_img=""  ]
[glink  color="orange"  storage="scene2_food_sapporo.ks"  size="20"  text="スープカレー"  autopos="false"  target="*soupcurry"  x="553"  y="334"  width=""  height=""  _clickable_img=""  ]
[s  ]
*ramen

[tb_eval  exp="f.food=1"  name="food"  cmd="="  op="t"  val="1"  val_2="undefined"  ]
[tb_start_text mode=1 ]
俺「味噌ラーメンがいい。寒いし、まずは温まりたい」[p]

[_tb_end_text]

[chara_mod  name="初音ミク"  time="1000"  cross="false"  storage="chara/1/んま～.png"  ]
[chara_hide  name="初音ミク"  time="1000"  wait="true"  pos_mode="true"  ]
[tb_start_text mode=1 ]
ミク「彩未！！！！！！！」[p]
ミクは地図アプリを開くことすらせず、一目散に東豊線へ向かっていくのだった。[p]
[_tb_end_text]

[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[bg  time="1000"  method="crossfade"  storage="PXL_20250211_023717236.jpg"  ]
[mask_off  time="1000"  effect="fadeOut"  ]
[chara_show  name="初音ミク"  time="1000"  wait="true"  storage="chara/1/んま～.png"  width="651"  height="960"  left="805"  top="133"  reflect="false"  ]
[tb_start_text mode=1 ]
俺「なにこれ、めっちゃおいしい。ちぢれ麺と香ばしいモヤシ炒めにショウガのアクセントが神懸ってる」[p]
ミク「わかる、器もいいんだよね～～幅広で低いからすごい食べやすい！」[p]
ミクと俺は、熱々の味噌ラーメンを夢中ですすって食べた。[p]
[_tb_end_text]

[chara_hide  name="初音ミク"  time="1000"  wait="true"  pos_mode="true"  ]
[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[jump  storage="scene3_trip_sapporo.ks"  target="*top"  ]
[s  ]
*soupcurry

[tb_eval  exp="f.food=2"  name="food"  cmd="="  op="t"  val="2"  val_2="undefined"  ]
[tb_start_text mode=1 ]
俺「せっかくだし、スープカレー行こっか！」[p]

[_tb_end_text]

[chara_mod  name="初音ミク"  time="600"  cross="false"  storage="chara/1/んま～.png"  ]
[tb_start_text mode=1 ]
ミク「スープカレーきた～！！！まぁ行くところはあそこしかないよねぇ～～」[p]
僕は目的地も分からず、東西線へ連れていかれるのだった。[p]
[_tb_end_text]

[chara_hide  name="初音ミク"  time="1000"  wait="true"  pos_mode="true"  ]
[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[bg  time="1000"  method="crossfade"  storage="mazisupa.jpg"  ]
[mask_off  time="1000"  effect="fadeOut"  ]
[chara_show  name="初音ミク"  time="1000"  wait="true"  storage="chara/1/んま～.png"  width="651"  height="960"  left="805"  top="133"  reflect="false"  ]
[tb_start_text mode=1 ]
ミク「覚醒・瞑想・悶絶・涅槃・極楽・天空・虚空……今日は天空にしようかなぁ？」[p]
俺「何言ってんの？」[p]
ミク「マジックスパイス（店名）の段位。信心深く修行を続ければ……っていうのは半分嘘で、辛さのレベルだよ。涅槃（ねはん）が中辛で虚空が死ぬほど辛いよ！ミクでも挑戦したことない！」[p]
俺「えぇ……こわ……俺はミクの言う通り涅槃にしよう……てか、なにこれ？」[p]
[_tb_end_text]

[bg  time="1000"  method="crossfade"  storage="mazisupa_mikudarake.jpg"  ]
[chara_hide  name="初音ミク"  time="1000"  wait="true"  pos_mode="true"  ]
[tb_start_text mode=1 ]
ミクにハメられたか……とちょっと身構えたものの、スープカレーはめちゃめちゃおいしかった。[r]骨付きの肉。あふれんばかりの野菜。「スープ」とは正直嘘なのかもしれない。[p]
[_tb_end_text]

[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[jump  storage="scene3_trip_sapporo.ks"  target="*top"  ]
