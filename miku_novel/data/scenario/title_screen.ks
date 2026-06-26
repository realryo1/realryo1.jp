[_tb_system_call storage=system/_title_screen.ks]

*title


;==============================
; タイトル画面
;==============================


[hidemenubutton]

[tb_clear_images]

[tb_keyconfig  flag="0"  ]

;標準のメッセージレイヤを非表示


[tb_hide_message_window  ]

;タイトル表示


[bg  storage="title.jpg"  ]
[mask_off  time="1000"  effect="fadeOut"  ]
[tb_ptext_show  x="264"  y="262.00001525878906"  size="70"  color="0x0dffdf"  time="1000"  text="ふぁんふぁんとりっぷ！"  anim="false"  face="sans-serif,'メイリオ'"  edge="undefined"  shadow="undefined"  ]
[glink  color="white"  text="はじめから"  x="559"  y="472"  size="20"  target="*start"  width=""  height=""  _clickable_img=""  ]
[s  ]

;-------ボタンが押されたときの処理


*start

[showmenubutton]

[cm  ]
[tb_keyconfig  flag="1"  ]
[tb_ptext_hide  time="1000"  ]
[jump  storage="scene1.ks"  target=""  ]
[s  ]
