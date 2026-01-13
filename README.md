# luci-app-dae

<img src="https://github.com/daeuniverse/dae/blob/main/logo.png" border="0" width="20%">

LuCI app for dae.

Run dae, edit config, watch log.


## About

With no external dependency, this LuCI app run dae binary as procd service and and provide direct access to its config file.

Useful to users who care little about subscribtion related stuff and treat dae as a transparent inbound only.

Does NOT complile dae itself. Run the [installer script](https://github.com/Pacalini/luci-app-dae/blob/main/root/usr/share/dae/installer.sh) in terminal, or download manually.

Developed & tested on mainline Openwrt 24.10 & 25.12.

![screenshot](https://github.com/user-attachments/assets/d7d22243-9d12-46c1-a79d-5b6aebd9e501)

## TODO

- Update button
> For now, run `/usr/share/dae/installer.sh install` to install/update dae.
> 
> Add
> ```
> /usr/bin/dae
> /usr/share/dae
> /etc/dae
> ```
> to `/etc/sysupgrade.conf` to keep them on sysupgrade.
- Translation

Read dae docs and examples carefully. Feel free to contribute.
