include $(TOPDIR)/rules.mk

PKG_NAME:=macchina
PKG_VERSION:=6.0.6
PKG_RELEASE:=$(AUTORELEASE)

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION)
PKG_SOURCE_URL:=https://github.com/Macchina-CLI/macchina/releases/download/v$(PKG_VERSION)/$(PKG_NAME)-linux-x86_64?
PKG_HASH:=0a5bc95c22ed31035f4e905c75124062c3e8501199005f7f181e7c6f0ea77113
PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)-$(PKG_VERSION)

# ifeq ($(ARCH),aarch64)
# 	PKG_SOURCE:=$(PKG_NAME)-linux-aarch64
# 	PKG_HASH:=skip
# else ifeq ($(ARCH),x86_64)
# 	PKG_SOURCE:=$(PKG_NAME)-linux-x86_64
# 	PKG_HASH:=skip
# # Set the default value to make OpenWrt Package Checker happy
# else
# 	PKG_SOURCE:=dummy
# 	PKG_HASH:=dummy
# endif

PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE
PKG_MAINTAINER:=Aziz Ben Ali <ba.tahaaziz@gmail.com>

include $(INCLUDE_DIR)/package.mk

define Package/$(PKG_NAME)
	SECTION:=utils
	CATEGORY:=Utilities
	TITLE:=A system information frontend, with an (unhealthy) emphasis on performance.
	URL:=https://github.com/Macchina-CLI/macchina
	DEPENDS:=+wget-ssl
endef

define Package/$(PKG_NAME)/description
	A system information frontend, with an (unhealthy) emphasis o n performance.
endef

CONFIGURE_ARGS+= --enable-downloader=wget

define Build/Prepare
	mkdir -p $(PKG_BUILD_DIR)
endef

define Build/Compile

endef

define Package/$(PKG_NAME)/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(DL_DIR)/$(PKG_SOURCE) $(1)/usr/bin/$(PKG_NAME)
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
