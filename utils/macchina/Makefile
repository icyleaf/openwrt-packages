include $(TOPDIR)/rules.mk

PKG_NAME:=macchina
PKG_VERSION:=6.1.5
PKG_RELEASE:=$(AUTORELEASE)

ifeq ($(ARCH),x86_64)
	PKG_SOURCE:=$(PKG_NAME)-linux-x86_64-$(PKG_VERSION)
	PKG_SOURCE_URL:=https://github.com/Macchina-CLI/macchina/releases/download/v$(PKG_VERSION)/$(PKG_NAME)-linux-x86_64?
	PKG_HASH:=aa0da22a13324b700383c1bfc1ea33216cdc8cc9f57c8186651caa0e2e49761e
else ifeq ($(ARCH),aarch64)
	PKG_SOURCE:=$(PKG_NAME)-linux-aarch64-$(PKG_VERSION)
	PKG_SOURCE_URL:=https://github.com/Macchina-CLI/macchina/releases/download/v$(PKG_VERSION)/$(PKG_NAME)-linux-aarch64?
	PKG_HASH:=09274b8220530c5e860727dcce5f8ab8e88205700eb99f43f1eea7ef905e4052
else
	PKG_SOURCE:=dummy
	PKG_SOURCE_URL:=dummy
	PKG_HASH:=dummy
endif

PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_SOURCE)
PKG_CAT:=skip
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE
PKG_MAINTAINER:=Aziz Ben Ali <ba.tahaaziz@gmail.com>

include $(INCLUDE_DIR)/package.mk

define Package/$(PKG_NAME)
	SECTION:=utils
	CATEGORY:=Utilities
	TITLE:=A system information frontend, with an (unhealthy) emphasis on performance.
	URL:=https://github.com/Macchina-CLI/macchina
	DEPENDS:=+libc +libsqlite3 +libpthread
endef

define Package/$(PKG_NAME)/description
	A system information frontend, with an (unhealthy) emphasis on performance.
endef

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
