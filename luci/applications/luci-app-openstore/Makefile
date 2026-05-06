include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-openstore
PKG_MAINTAINER:=icyleaf <icyleaf.cn@gmail.com>
PKG_LICENSE:=GPL-3.0
PKG_VERSION:=0.1.0
PKG_RELEASE:=$(AUTORELEASE)

LUCI_TITLE:=LuCI App OpenStore
LUCI_DESCRIPTION:=OpenStore app for downloading official releases by architecture with a configurable catalog
LUCI_DEPENDS:=+luci-base +jsonfilter +uclient-fetch +ca-bundle +tar +gzip
LUCI_PKGARCH:=all

include $(TOPDIR)/feeds/luci/luci.mk

define Package/$(PKG_NAME)/conffiles
	/etc/config/openstore
endef

define Package/$(PKG_NAME)/install
	$(INSTALL_DIR) $(1)/etc/config
endef

# call BuildPackage - OpenWrt buildroot signature
