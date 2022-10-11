include $(TOPDIR)/rules.mk

PKG_NAME:=neofetch
PKG_VERSION:=20211210-master
PKG_VERSION_GIT_SHA:=ccd5d9f52609bbdcd5d8fa78c4fdb0f12954125f
PKG_RELEASE:=$(AUTORELEASE)

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://codeload.github.com/dylanaraps/neofetch/tar.gz/$(PKG_VERSION_GIT_SHA)?
PKG_HASH:=3fd5596bc11303cbfacf2771fac29cd20e3c20ea3b0a2bec07e2a7fb287a1968

PKG_LICENSE:=MIT
PKG_MAINTAINER:=icyleaf <icyleaf.cn@gmail.com>

include $(INCLUDE_DIR)/package.mk

define Package/$(PKG_NAME)
	SECTION:=utils
	CATEGORY:=Utilities
	TITLE:=A system information frontend, with an (unhealthy) emphasis on performance.
	URL:=https://github.com/dylanaraps/neofetch
	DEPENDS:=+libc
endef

define Package/$(PKG_NAME)/description
	A system information frontend, with an (unhealthy) emphasis on performance.
endef

define Build/Compile
endef

define Package/$(PKG_NAME)/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(BUILD_DIR)/$(PKG_NAME)-$(PKG_VERSION_GIT_SHA)/$(PKG_NAME) $(1)/usr/bin/$(PKG_NAME)
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
