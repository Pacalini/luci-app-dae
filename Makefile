# This is free software, licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3.

include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-dae
PKG_VERSION:=0.1.0
PKG_RELEASE:=1

LUCI_TITLE:=LuCI app for dae 
LUCI_DEPENDS:=+luci-base +curl +unzip
LUCI_PKGARCH:=all

PKG_LICENSE:=AGPL-3.0

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
