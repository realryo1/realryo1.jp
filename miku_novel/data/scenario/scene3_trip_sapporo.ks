[_tb_system_call storage=system/_scene3_trip_sapporo.ks]

*top

[chara_hide_all  time="0"  wait="false"  ]
[bg  time="1000"  method="crossfade"  storage="PXL_20250210_034818535.jpg"  ]
[mask_off  time="1000"  effect="fadeOut"  ]
[tb_show_message_window  ]
[tb_start_text mode=1 ]
15:00　札幌駅[p]
[_tb_end_text]

[chara_show  name="初音ミク"  time="1000"  wait="true"  storage="chara/1/喋り_普通.png"  width="650"  height="960"  left="312"  top="1"  reflect="false"  ]
[tb_start_text mode=1 ]
ミク「はぁ～～～おなか一杯食べて幸せ～～」[p]
俺「いや～～本当においしかったね～～！[r]と……そろそろおなかも落ち着いてきたし、次行くところ探す？」[p]
ミク「いいねぇ～～このあたりと言ったら、大通公園とかテレビ塔、白い恋人パークもいいんじゃない？」[p]
[_tb_end_text]

[glink  color="red"  storage="scene3_trip_sapporo.ks"  size="20"  text="大通公園&テレビ塔"  autopos="false"  target="*park_tower"  y="273"  x="519"  width=""  height=""  _clickable_img=""  ]
[glink  color="blue"  storage="scene3_trip_sapporo.ks"  size="20"  text="白い恋人パーク"  autopos="false"  target="*shiroikoibito"  x="538"  y="334"  width=""  height=""  _clickable_img=""  ]
[s  ]
*park_tower

[tb_eval  exp="f.trip=1"  name="trip"  cmd="="  op="t"  val="1"  val_2="undefined"  ]
[chara_mod  name="初音ミク"  time="1000"  cross="false"  storage="chara/1/やった～_-_コピー.png"  ]
[tb_start_text mode=1 ]
ミク「大通公園！いいねぇ～～ 札駅からはそんな遠くないし、歩いていこっか！」[p]
俺「テレビ塔も行こう！」[p]

[_tb_end_text]

[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[chara_hide  name="初音ミク"  time="1000"  wait="true"  pos_mode="true"  ]
[bg  time="1000"  method="crossfade"  storage="oodoori.jpg"  ]
[mask_off  time="1000"  effect="fadeOut"  ]
[chara_show  name="初音ミク"  time="1000"  wait="true"  storage="chara/1/やった～_-_コピー.png"  width="692"  height="1041"  left="746"  top="110"  reflect="false"  ]
[tb_start_text mode=1 ]
俺「この空気気持ちいい～～花壇には花がたくさんで、ベビーカーを連れた家族連れもたくさん。ずっと居たい」[p]
ミク「だよね～～！噴水も涼しげでいい感じ！テレビ塔のふもとには出店がたくさんで退屈しないよね！」[p]
ひとしきり公園を散策したのち、正面の展望台に登ることに。[p]
[_tb_end_text]

[bg  time="1000"  method="crossfade"  storage="tenboudai.png"  ]
[tb_start_text mode=1 ]
ミク「なんだかんだ登るのは初めてかも！！大通の町って上から見るとこんなきれいなんだね！」[p]
俺「そうだね～～ 札幌の町は"碁盤の目"とかよく言われる、計画都市だからなおさら？」[p]

[_tb_end_text]

[chara_mod  name="初音ミク"  time="1000"  cross="false"  storage="chara/1/kiran.png"  ]
[tb_start_text mode=1 ]
ミク「うんうん！ちなみに、大通公園は都市計画の基準ともなっていて、北側は官庁・ビジネス街、南側は繁華街って分けられ方をしてる。火防線の役割もあって、町全体の被害を下げる工夫でもあるんだよ！」[p]
俺（キラキラした目で札幌知識を披露してるミクが一番かわいいんだよな……）[p]
ミクと俺は、ひとしきり空中散歩を楽しんだのち、テレビ塔の記念コインを片手にその場を後にした。[p]
[_tb_end_text]

[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[chara_hide  name="初音ミク"  time="1000"  wait="true"  pos_mode="true"  ]
[jump  storage="scene4_end_sapporo.ks"  target="*top"  ]
[s  ]
*shiroikoibito

[tb_eval  exp="f.trip=2"  name="trip"  cmd="="  op="t"  val="2"  val_2="undefined"  ]
[tb_start_text mode=1 ]
俺「白い……」[p]

[_tb_end_text]

[chara_mod  name="初音ミク"  time="600"  cross="false"  storage="chara/1/やった～_-_コピー.png"  ]
[tb_start_text mode=1 ]
ミク「恋人パーク！！！！ [r]マスターとミクみたいだね！！」[p]
俺「う、うん、ありがとう……！」[p]
ミクは突然心臓に悪いことを言ってくる。それが可愛いところなのだが……[p]

[_tb_end_text]

[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[chara_hide  name="初音ミク"  time="1000"  wait="true"  pos_mode="true"  ]
[bg  time="1000"  method="crossfade"  storage="kotibito_main05-1200x600-1.jpg"  ]
[mask_off  time="1000"  effect="fadeOut"  ]
[chara_show  name="初音ミク"  time="1000"  wait="true"  storage="chara/1/やった～_-_コピー.png"  width="636"  height="978"  left="801"  top="48"  reflect="false"  ]
[tb_start_text mode=1 ]
ミク「きた～～っ！白い恋人パーク！最高のデート日和だねぇ～～！」[r][r]おもむろに手を差し出してくるミク[p]
俺「ちょ、手をつなぐのは……」[p]
[_tb_end_text]

[chara_mod  name="初音ミク"  time="600"  cross="false"  storage="chara/1/runrun.png"  ]
[tb_start_text mode=1 ]
ミク「いいじゃんいいじゃん♪ほら周りみてみなよ！」[p]
俺「みんなよそのミクたちとデートしてる……普通なのか」[p]
おしゃれで浮ついた雰囲気に戸惑いながらも、おかし作り体験に向かうことにした[p]
[_tb_end_text]

[bg  time="1000"  method="crossfade"  storage="image.png"  ]
[tb_start_text mode=1 ]
俺「やっぱ実際に作るほうがテンション上がるな」[p]
ミク「だよねだよね～～！！」[p]
俺「……うん。大崩壊してるけど大丈夫？？」[p]
[_tb_end_text]

[chara_mod  name="初音ミク"  time="600"  cross="false"  storage="chara/1/i-.png"  ]
[tb_start_text mode=1 ]
ミク「うるさいうるさい！！ますたーがうまいだけなんだーー！！」[p]
正直何を書いているのか読めなかったが、キレ方から見るに大切なことだったのだろうか。[p]
[_tb_end_text]

[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[chara_hide  name="初音ミク"  time="1000"  wait="true"  pos_mode="true"  ]
[jump  storage="scene4_end_sapporo.ks"  target="*top"  ]
