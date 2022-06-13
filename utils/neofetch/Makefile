include $(TOPDIR)/rules.mk

PKG_NAME:=neofetch
PKG_VERSION:=master
PKG_RELEASE:=0.1.0

PKG_SOURCE:=$(PKG_NAME)
PKG_SOURCE_URL:=https://raw.githubusercontent.com/dylanaraps/neofetch/$(PKG_VERSION)
PKG_HASH:=f482e5e84a6aa1e5a5bd547883d9c1cb16ba20b0

PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE.md
PKG_MAINTAINER:=dylanaraps <dylan.araps@gmail.com>

include $(INCLUDE_DIR)/package.mk

define Package/$(PKG_NAME)
	SECTION:=utils
  CATEGORY:=Utilities
	TITLE:=A command-line system information tool written in bash 3.2+
	URL:=https://github.com/dylanaraps/neofetch
  DEPENDS:=+bash +wget-ssl
endef

define Package/$(PKG_NAME)/description
	A command-line system information tool written in bash 3.2+
endef

CONFIGURE_ARGS+= --enable-downloader=wget

define Package/$(PKG_NAME)/install
	$(INSTALL_DIR) $(1)/usr/bin
  $(INSTALL_BIN) $(PKG_INSTALL_DIR)/$(PKG_NAME) $(1)/usr/bin/$(PKG_NAME)
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
