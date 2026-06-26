[_tb_system_call storage=system/_scene4_end_sapporo.ks]

*top

[chara_hide_all  time="0"  wait="false"  ]
[bg  time="1000"  method="crossfade"  storage="PXL_20250209_124425193.jpg"  ]
[mask_off  time="1000"  effect="fadeOut"  ]
[tb_show_message_window  ]
[tb_start_text mode=1 ]
21:00　札幌駅[p]
[_tb_end_text]

[chara_show  name="初音ミク"  time="1000"  wait="true"  storage="chara/1/やった～_-_コピー.png"  width="696"  height="1067"  left="296"  top="-20"  reflect="false"  ]
[tb_start_text mode=1 ]
ミク「今日は一日いろんなところに行ったねぇ～」[p]
[_tb_end_text]

[chara_mod  name="初音ミク"  time="1000"  cross="false"  storage="chara/1/んま～.png"  ]
[jump  storage="scene4_end_sapporo.ks"  target="*ramen"  cond="f.food==1"  ]
[jump  storage="scene4_end_sapporo.ks"  target="*soupcurry"  cond="f.food==2"  ]
*ramen

[tb_start_text mode=1 ]
ミク「彩未の味噌ラーメンは本当においしかった！！次は大盛二杯頼もうかな！！」[p]
[_tb_end_text]

[jump  storage="scene4_end_sapporo.ks"  target="*twoIF"  ]
*soupcurry

[tb_start_text mode=1 ]
ミク「マジックスパイスのスープカレーは本当においし……んー、さすがに辛かったよ……次は極楽にしよう……」[p]
[_tb_end_text]

*twoIF

[chara_mod  name="初音ミク"  time="1000"  cross="false"  storage="chara/1/閉じ_普通.png"  ]
[jump  storage="scene4_end_sapporo.ks"  target="*park_tower"  cond="f.trip==1"  ]
[jump  storage="scene4_end_sapporo.ks"  target="*shiroikoibito"  cond="f.trip==2"  ]
*park_tower

[tb_start_text mode=1 ]
俺「大通公園の空気も良かったよね。満たされたおなかと一緒に優しく癒してくれた」[p]
ミク「あ！そうだ。これ、ミクはこんなにしたんだよ～～！」[p]
ミクが出してきたのは、テレビ塔の帰りがけに作った記念コインだった。[p]
＝＝　MASTA- DAISUKE　＝＝[p]
俺「ますたー、だいすけ？」[p]
[_tb_end_text]

[jump  storage="scene4_end_sapporo.ks"  target="*finalend"  ]
*shiroikoibito

[tb_start_text mode=1 ]
俺「白い恋人パーク。ミクとたくさん写真を撮れたし、お菓子作り体験も楽しかったなぁ」[p]
ミク「あ！そうだ。これ、ミクからのプレゼント……！」[p]
＝＝　ﾏすたー だｲすきたよ　＝＝[p]
俺「これは、件の大崩壊した……」[p]
[_tb_end_text]

*finalend

[chara_mod  name="初音ミク"  time="1000"  cross="false"  storage="chara/1/i-.png"  ]
[tb_start_text mode=1 ]
ミク「あっ……」（やっぱダメだったか……）[p]
さすがに笑いをこらえきれない俺。でも、その思いは十分伝わった[p]
ミク「もう！これあげる！ほらうれしいでしょ！！！！」[p]
俺「ありがとう。ミク、大好きだよ」[p]
[_tb_end_text]

[chara_mod  name="初音ミク"  time="1000"  cross="false"  storage="chara/1/tere_-_コピー.png"  ]
[tb_start_text mode=1 ]
ミク「……ありがとう！私も大好きだよ！！」[p]

[_tb_end_text]

[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[chara_hide  name="初音ミク"  time="1000"  wait="true"  pos_mode="true"  ]
[bg  time="1000"  method="crossfade"  storage="title.jpg"  ]
[tb_hide_message_window  ]
[mask_off  time="1000"  effect="fadeOut"  ]
[tb_ptext_show  x="554.0000305175781"  y="297.00001525878906"  size="70"  color="0xffffff"  time="1000"  text="おわり"  anim="false"  face="undefined"  edge="undefined"  shadow="undefined"  ]
[l  ]
[tb_ptext_hide  time="1000"  ]
[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[tb_show_message_window  ]
[mask_off  time="1000"  effect="fadeOut"  ]
[tb_start_text mode=1 ]
！注意！[r]現在、北海道新幹線は新函館北斗駅で終点です。また、「はつね号」という新幹線の列車もありません。開業予定は2038年度の予定とされています。[r]このお話は少しだけ未来の話を描いたお話です！これら以外はすべて事実です。[p]
[_tb_end_text]

[tb_start_text mode=1 ]
使用素材[p]
[_tb_end_text]

[bg  time="1000"  method="crossfade"  storage="2defd3e7.jpg"  ]
[tb_start_text mode=1 ]
札幌新幹線駅：https://www.jrhokkaido.co.jp/corporate/shinkansen/stretching.html[p]
[_tb_end_text]

[bg  time="1000"  method="crossfade"  storage="oodoori.jpg"  ]
[tb_start_text mode=1 ]
大通公園（テレビ塔）：https://jp.zekkeijapan.com/spot/index/14/[p]
[_tb_end_text]

[bg  time="1000"  method="crossfade"  storage="tenboudai.png"  ]
[tb_start_text mode=1 ]
テレビ塔からの風景：https://www.visit-hokkaido.jp/spot/detail_10004.html[p]
[_tb_end_text]

[bg  time="1000"  method="crossfade"  storage="kotibito_main05-1200x600-1.jpg"  ]
[tb_start_text mode=1 ]
白い恋人パーク（風景・お菓子作り）：https://www.sapporo.travel/spot/facility/shiroi_koibito_park/[p]
[_tb_end_text]

[bg  time="1000"  method="crossfade"  storage="PXL_20250209_124425193.jpg"  ]
[tb_start_text mode=1 ]
それ以外の写真：全部自分撮影[p]
[_tb_end_text]

[bg  time="1000"  method="crossfade"  storage="title.jpg"  ]
[chara_show  name="初音ミク"  time="1000"  wait="true"  storage="chara/1/やった～_-_コピー.png"  width="736"  height="1185"  left="283"  top="-58"  reflect="false"  ]
[tb_start_text mode=1 ]
初音ミクの立ち絵：浅井麻[r]https://asavo.fanbox.cc/posts/3660618[p]
[_tb_end_text]

[chara_mod  name="初音ミク"  time="600"  cross="true"  storage="chara/1/kiran.png"  ]
[tb_start_text mode=1 ]
この作品はhttps://piapro.jp/license/pcl/summaryに基づいてクリプトン・フューチャー・メディア株式会社のキャラクター「初音ミク」を描いたものです。[p]
[_tb_end_text]

[chara_hide  name="初音ミク"  time="1000"  wait="true"  pos_mode="true"  ]
[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[jump  storage="title_screen.ks"  target=""  ]
