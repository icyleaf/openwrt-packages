include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-vector
PKG_MAINTAINER:=icyleaf <icyleaf.cn@gmail.com>
PKG_LICENSE:=GPL-3.0
PKG_VERSION:=0.1.20
PKG_RELEASE:=$(AUTORELEASE)

LUCI_TITLE:=LuCI for Vector
LUCI_DESCRIPTION:=Provides Luci for vector
LUCI_DEPENDS:=+luci-base +curl
LUCI_PKGARCH:=all

# define Package/$(PKG_NAME)/conffiles
# 	/etc/config/vector
# 	/etc/vector/config.yaml
# endef

# define Package/$(PKG_NAME)/install
# 	$(call Package/$(PKG_NAME)/install/default)
# 	$(INSTALL_DIR) $(1)/etc/config $(1)/etc/init.d
# endef

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
