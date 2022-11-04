include $(TOPDIR)/rules.mk

PKG_NAME:=vector
PKG_VERSION:=0.25.0
PKG_RELEASE:=$(AUTORELEASE)

PKG_SOURCE_HEADER:=$(PKG_NAME)-$(PKG_VERSION)-$(ARCH)
PKG_SOURCE_BODY:=unknown-linux-musl
PKG_SOURCE_FOOTER:=tar.gz
PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_SOURCE_HEADER)-$(PKG_RELEASE)

ifeq ($(ARCH),x86_64)
	PKG_SOURCE_NAME:=$(PKG_NAME)-$(ARCH)-$(PKG_SOURCE_BODY)
	PKG_SOURCE:=$(PKG_SOURCE_HEADER)-$(PKG_SOURCE_BODY).$(PKG_SOURCE_FOOTER)
	PKG_SOURCE_URL:=https://github.com/vectordotdev/vector/releases/download/v$(PKG_VERSION)/$(PKG_SOURCE)?
	PKG_HASH:=6475f4445ad6f516d6e3a257c1ae8ae9e49eebb4f59f076af885e2693e3485e9
else ifeq ($(ARCH),aarch64)
	PKG_SOURCE_NAME:=$(PKG_NAME)-$(ARCH)-$(PKG_SOURCE_BODY)
	PKG_SOURCE:=$(PKG_SOURCE_HEADER)-$(PKG_SOURCE_BODY).$(PKG_SOURCE_FOOTER)
	PKG_SOURCE_URL:=https://github.com/vectordotdev/vector/releases/download/v$(PKG_VERSION)/$(PKG_SOURCE)?
	PKG_HASH:=9b380ad448cb57188ee4a165142b3f1fca0c75e37e90f4b8b8c0e0157e6ff8b0
else
	PKG_SOURCE_NAME:=dummy
	PKG_SOURCE:=dummy
	PKG_SOURCE_URL:=dummy
	PKG_HASH:=dummy
endif

PKG_LICENSE:=MIT
PKG_MAINTAINER:=icyleaf <icyleaf.cn@gmail.com>

include $(INCLUDE_DIR)/package.mk

STRIP:=true

TAR_CMD=$(HOST_TAR) -C $(1)/ $(TAR_OPTIONS)

define Package/$(PKG_NAME)
	SECTION:=utils
	CATEGORY:=Utilities
	TITLE:=A high-performance observability data pipeline.
	URL:=https://github.com/vectordotdev/vector
	DEPENDS:=@(aarch64||arm||x86_64) @!(i386||mips||mipsel||TARGET_x86_geode||TARGET_x86_legacy)
endef

define Package/$(PKG_NAME)/description
	A high-performance observability data pipeline.
endef

define Build/Compile
endef

define Package/$(PKG_NAME)/conffiles
/etc/config/$(PKG_NAME)
/etc/$(PKG_NAME)/config.yml
endef

define Package/$(PKG_NAME)/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/$(PKG_SOURCE_NAME)/bin/$(PKG_NAME) $(1)/usr/bin/$(PKG_NAME)

	$(INSTALL_DIR) $(1)/etc/config $(1)/etc/$(PKG_NAME) $(1)/etc/init.d $(1)/etc/uci-defaults
	$(INSTALL_CONF) $(CURDIR)/files/etc/config/$(PKG_NAME) $(1)/etc/config/$(PKG_NAME)
	$(INSTALL_CONF) $(CURDIR)/files/etc/$(PKG_NAME)/config.yml $(1)/etc/$(PKG_NAME)/config.yml
	$(INSTALL_BIN) $(CURDIR)/files/etc/uci-defaults/50_vector $(1)/etc/uci-defaults/50_vector

	$(CP) $(PKG_BUILD_DIR)/$(PKG_SOURCE_NAME)/config $(1)/etc/$(PKG_NAME)/config_examples

	$(INSTALL_BIN) $(CURDIR)/files/etc/init.d/$(PKG_NAME) $(1)/etc/init.d/$(PKG_NAME)
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
