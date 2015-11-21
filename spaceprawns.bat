@echo off
CD C:\wamp
start wampmanager.exe
CD C:\Program Files\Sublime Text 2
start sublime_text.exe
CD C:\wamp\www\spaceprawns
start grunt
CD C:\
start http://localhost/spaceprawns/index.html