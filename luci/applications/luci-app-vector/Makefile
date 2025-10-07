# Licensed to the public under the GPL V3 License.

include $(TOPDIR)/rules.mk

LUCI_TITLE:=LuCI for Vector
LUCI_DESCRIPTION:=Provides Luci for vector
LUCI_DEPENDS:=+luci-base +curl
LUCI_PKGARCH:=all

PKG_MAINTAINER:=icyleaf <icyleaf.cn@gmail.com>
PKG_LICENSE:=GPL-3.0
PKG_VERSION:=0.1.4
PKG_RELEASE:=$(AUTORELEASE)

include $(TOPDIR)/feeds/luci/luci.mk

define Package/luci-app-vector/install
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_DIR) $(1)/etc/config
endef

# call BuildPackage - OpenWrt buildroot signature
